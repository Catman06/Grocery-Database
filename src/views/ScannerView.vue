<script setup>
import { onBeforeUnmount } from 'vue';



// Sets up getting video from the user
let constraints = {
  video: {
    aspectRatio: { ideal: 1 },
  },
  audio: false,
};

let mediaStream;
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    mediaStream = stream;
    document.getElementById('video').srcObject = mediaStream;
    document.getElementById('video').play();
  })
  .catch((error) => { console.error(`Failed to get video: ${error}`) });

// Turns off camera when navigating away from the scanner
onBeforeUnmount(() => {
  console.log('Stopping camera');
  mediaStream.getTracks().forEach(track => {
    track.stop();
  });
})
</script>

<template>
  <div id="videoWrapper">
    <video id="video"></video>
  </div>
</template>

<style>
#videoWrapper {
  background-color: var(--accent-dark-grey);
  width: 90%;
  height: 75%;
  margin: auto;
}

#video {
  width: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

@media (min-width: 1024px) {
  h1 {
    min-height: 100vh;
    display: flex;
  }
}
</style>