<script setup>
import AddModal from '@/components/AddModal.vue';
import { useDatabaseStore } from '@/stores/database';
import { onBeforeUnmount, ref, watch } from 'vue';

//// Sets up getting video from the user
// Constraints for getting specifically the outward facing camera without audio
let constraints = {
  video: {
    facingMode: { ideal: 'environment' }
  },
  audio: false,
};
// Gets the mediaStream using the set constraints and plays it on the video element
let mediaStream;
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    mediaStream = stream;
    document.getElementById('video').srcObject = mediaStream;
    document.getElementById('video').play();
  })
  .catch((error) => {
    console.error(`Failed to get video: ${error}`);
  });

// Turns off camera when navigating away from the scanner
onBeforeUnmount(() => {
  console.log('Stopping camera');
  mediaStream.getTracks().forEach(track => {
    track.stop();
  });
})

// Captures frames to the canvas element (which is not displayed) to allow ImageData to be extracted and returned
function frameCapture(params) {
  try {
    let player = document.getElementById('video');
    let canvas = document.getElementById('frameCapture');

    // Sets the canvas to the dimensions of the video
    canvas.setAttribute('width', player.videoWidth);
    canvas.setAttribute('height', player.videoHeight);

    // Places the captured image into the canvas
    const context = canvas.getContext('2d');
    context.drawImage(player, 0, 0, player.videoWidth, player.videoHeight);

    // Takes the image on the canvas and returns it's ImageData
    return context.getImageData(0, 0, player.videoWidth, player.videoHeight);

  } catch (error) {
    console.error(`Failed to capture a frame: ${error}`);
  }
}

//// Repeatedly decodes the frame while scanning is true
const scanning = ref(false);
// Allows easy toggling of scanning
function toggleScanning(event) {
  console.log("Toggling Scanning");
  scanning.value = !scanning.value;
}
// Runs decode repeatedly
let intervalID;
watch(scanning, async () => {
  if (scanning.value) {
    intervalID = setInterval(decode, 200);
  } else {
    clearInterval(intervalID);
  }
})
// Create the worker to do the decoding on another thread
const bartender = new Worker(new URL('@/decoding/bartender', import.meta.url), { type: 'module' });
// Runs a decode to deal with the first run being long
bartender.postMessage(null);
// Send the image to bartender as long as another image isn't being processed (as recorded by 'working')
let working = false;
function decode() {
  if (!working) {
    working = true;
    let image = frameCapture()
    bartender.postMessage(image);
  }
}
// Handles the return message from bartender, sets 'working'
bartender.onmessage = async (result) => {
  if (result.data[0] != "Nothing Found") {
    scanning.value = false;
    console.log(result.data);
    itemConfirm(result.data[0], result.data[1]);
  }
  working = false;
}
// Gets information on the product from OpenFoodFacts
async function getOFF(barcode) {
  try {
    let response = await fetch("https://world.openfoodfacts.net/api/v2/product/" + barcode + "?fields=product_name_en,allergens_tags,brand_owner,brand,categories_tags", { method: "GET" });
    response = await response.json();
    return response;
  } catch (error) {
    console.error(`Failed to get data from OFF: ${error}`);
  }
}
// Shows the modal for confirmation of the scanned item
async function itemConfirm(barcode, format) {
  let modal = document.getElementById("itemModal");

  // Try to get the item from the database, if it doesn't exist getItemByCode will return undefined
  await useDatabaseStore().update();
  let dbItem = useDatabaseStore().getItemByCode(barcode);
  let offData;
  // Depending on whether the item already exists in the database, either fill the modal with the info from the database or OFF
  if (format == "upc a" | "upc e" | "ean 13" | "ean 8") {
    if (dbItem != undefined) {
      fillModal(dbItem);
    } else {
      offData = await getOFF(barcode);
      console.log(offData);
      // Remove the 'en:' bit at the start of received allergens.
      let allergens = offData.product.allergens_tags;
      allergens.forEach((tag, index) => {
        console.log(tag);
        allergens[index] = tag.replace(/en:/, '');
        console.log(tag);
      });
      console.log(allergens);
      let offItem = {
        barcode: barcode,
        given_name: offData.product.product_name_en,
        off_name: offData.product.product_name_en,
        number: 1,
        allergens: allergens,
        tags: new Array,
        favorite: false,
      }
      fillModal(offItem);
      console.log('newItem');
      console.log(newItem);
    }
  }
  modal.showModal();
}

// Fills the modal with the passed data
const newItem = ref({
  barcode: undefined,
  given_name: undefined,
  off_name: undefined,
  number: undefined,
  allergens: undefined,
  tags: undefined,
  favorite: undefined,
})
function fillModal(item) {
  newItem.value.barcode = item.barcode;
  newItem.value.given_name = item.given_name;
  newItem.value.off_name = item.off_name;
  newItem.value.number = item.number;
  newItem.value.allergens = (item.allergens === undefined ? new Array : item.allergens);
  newItem.value.tags = (item.tags === undefined ? new Array : item.tags);
  newItem.value.favorite = item.favorite;
}


function testItemModal() {
  newItem.value.barcode = 12345;
  newItem.value.given_name = 'Test Name';
  newItem.value.off_name = 'Test OFF Name';
  newItem.value.number = 5;
  newItem.value.allergens = ["allergen 1", "allergen 2"];
  newItem.value.tags = ["tag 1", "tag 2"];
  newItem.value.favorite = false;
  document.getElementById("itemModal").showModal();
}


</script>

<template>
  <div id="videoWrapper">
    <video id="video" playsinline></video>
    <ul id="controls">
      <button @click="toggleScanning">{{ scanning ? "Stop Scanning" : "Start Scanning" }}</button>
      <button @click="decode()">Capture Frame</button>
      <button @click="testItemModal">Test Modal</button>
    </ul>
    <canvas id="frameCapture"></canvas>
    <AddModal :item="newItem" :fullEdit="false" @closeModal="closeModal"></AddModal>
  </div>
</template>

<style scoped>
#videoWrapper {
  background-color: var(--accent-dark-grey);
  width: 90%;
  height: fit-content;
  margin: auto;
  border-radius: 0% 0% 10px 10px;
  border: 3px solid var(--accent-green);
  border-collapse: collapse;
}

#video {
  display: block;
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

#controls {
  background-color: var(--panel-color);
  border-spacing: 0;
  border-radius: inherit;
  border-top: inherit;
}

#controls button {
  border: none;
  border-radius: none;
  width: 33.333%;
  padding: .8rem 0px;
  transition: all .2s;
}

#controls button:first-of-type {
  border-bottom-left-radius: 7px;
}

#controls button:last-of-type {
  border-bottom-right-radius: 7px;
}

canvas {
  display: none;
}

@media (min-width: 1024px) {
  h1 {
    min-height: 100vh;
    display: flex;
  }
}
</style>