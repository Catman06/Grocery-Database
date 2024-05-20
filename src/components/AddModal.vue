<script setup>
import ListEditor from '@/components/ListEditor.vue';
import { useDatabaseStore } from '@/stores/database';
import { updateItem } from '@/database_interaction/dbAccess';
import { ref } from 'vue';

const props = defineProps(['item', 'fullEdit']);
let newItem = ref(props.item);

//// Controls for the tag editors
// Creates values for switching allergens and tags to and from edit mode
const allergensEdit = ref(false);
function toggleAllergenEdit(event) {
	allergensEdit.value = !allergensEdit.value;
}
const tagsEdit = ref(false);
function toggleTagEdit(event) {
	tagsEdit.value = !tagsEdit.value;
}

// Just closes the modal
function closeModal() {
	document.getElementById("itemModal").close();
}
// Closes the modal, submitting the item to the database
async function submitModal() {
	try {
		console.log('Submitting');
		let modal = document.getElementById('itemModal');

		let itemForm = new FormData();
		itemForm.append("barcode", modal.querySelector('#code').value);
		itemForm.append("given_name", modal.querySelector('#given_name').value);
		itemForm.append("off_name", modal.querySelector('#off_name').value);
		itemForm.append("number", modal.querySelector('#number').value);
		itemForm.append("allergens", JSON.stringify(newItem.value.allergens));
		itemForm.append("tags", JSON.stringify(newItem.value.tags));
		itemForm.append("favorite", favorite);
		itemForm.append("deleted", false);

		// Update the database
		console.info(itemForm);
		await updateItem(itemForm);

		// Update the store
		await useDatabaseStore().update();

		closeModal();
	} catch (error) {
		console.error(`Failed to submit item: ${error}`);
	}
}

// Hold the current value of the favorite checkbox.
let favorite = (newItem.value.favorite === undefined ? false : newItem.value.favorite);
function checkboxClick(event) {
	favorite = !favorite;
}
</script>

<template>
	<dialog id="itemModal">
		<ul>
			<div>
				<label for="code">Barcode</label>
				<input type="text" id="code" v-bind:value="newItem.barcode" v-bind:readonly="!fullEdit" />
			</div>
			<div>
				<label for="given_name">Name</label>
				<input type="text" id="given_name" v-bind:value="newItem.given_name"
					pattern="[^\s\t\n\r\{\}\\\[\]]([^\t\n\r\{\}\\\[\]]?)+"/>
			</div>
			<div>
				<label for="off_name">OFF Name</label>
				<input type="text" id="off_name" v-bind:value="newItem.off_name" v-bind:readonly="!fullEdit" />
			</div>
			<div>
				<label for="number">Number</label>
				<input type="number" id="number" v-bind:value="newItem.number" />
			</div>
			<div>
				<label for="allergens">Allergens</label>
				<input v-show="!allergensEdit" @focus="toggleAllergenEdit" type="text" id="allergens"
					v-bind:value="newItem.allergens" />
				<ListEditor class="editor" v-if="allergensEdit" v-bind:type="'allergens'" v-bind:list="newItem.allergens"
					@close-button="toggleAllergenEdit" />
			</div>
			<div>
				<label for="tags">Tags</label>
				<input v-show="!tagsEdit" @focus="toggleTagEdit" type="text" id="tags" v-bind:value="newItem.tags" />
				<ListEditor class="editor" v-if="tagsEdit" v-bind:type="'tags'" v-bind:list="newItem.tags"
					@close-button="toggleTagEdit" />
			</div>
			<div>
				<label for="favorite">Favorite</label>
				<input type="checkbox" id="favorite" v-bind:checked="newItem.favorite" @change="checkboxClick" />
			</div>

			<button @click.prevent="closeModal">Close</button>
			<button @click.prevent="submitModal">Submit</button>
		</ul>
	</dialog>
</template>

<style scoped>
dialog {
	background-color: var(--panel-color);
	border-radius: 10px 10px 10px 10px;
	border: 3px solid var(--accent-green);
	width: 80%;
}

dialog div {
	display: flex;
	background-color: var(--accent-light-grey);
	border-radius: 5px 5px 5px 5px;
	margin: 5px auto;
	padding: .5rem;
	align-content: center;
}

dialog input {
	width: 70%;
	min-width: 10rem;
	margin-left: 2rem;
	text-align: center;
	overflow-wrap: break-word;
}

@media (max-width: 1028px) {
	dialog div {
		flex-direction: column;
		align-content: center;
	}

	dialog input,
	dialog label {
		margin: auto;
		width: 90%;
	}
}

.editor {
	border-radius: 5px 5px 5px 5px;
	border: 3px solid var(--accent-green);
}
</style>