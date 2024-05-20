<script setup>
import ListEditor from './ListEditor.vue';
import { updateItem } from '@/database_interaction/dbAccess';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const selected = ref(useDatabaseStore().selected);
console.log('editPanel Loaded');
console.log('selected: ' + selected.value);
const info = ref(useDatabaseStore().getItemByCode(selected.value));

// When edit is clicked, sync any changes to the store then send the edit-clicked event
const saveButtonEvent = new Event('save-clicked', { bubbles: true });
function saveClick(event) {
	let tdTarget = event.target;
	syncToStore();
	tdTarget.dispatchEvent(saveButtonEvent);
}

// Sync any potential changes to useDatabaseStore along with 'deleted' set to signal a change has potentially been made
async function syncToStore() {
	try {
		console.log('Syncing');
		let panel = document.querySelector('.editable');
		let nameVal = panel.querySelector('.name').value == '' ? info.value.given_name : panel.querySelector('.name').value;
		let itemForm = new FormData();
		itemForm.append("barcode", info.value.barcode);
		itemForm.append("given_name", nameVal);
		itemForm.append("off_name", info.value.off_name);
		itemForm.append("number", panel.querySelector('.number').value);
		itemForm.append("allergens", JSON.stringify(allergens.value));
		itemForm.append("tags", JSON.stringify(tags.value));
		itemForm.append("favorite", favorite);
		itemForm.append("deleted", deleted);


		// Update the database
		await updateItem(itemForm);

		// If the item was deleted un-select it
		selected.value = undefined;

		// Update the store
		await useDatabaseStore().update();
	} catch (error) {
		console.error(`Failed to sync to the store: ${error}`);
	}
}
// Creates a local deep copy for holding temporary changes to the arrays
console.log(info);
const allergens = ref(JSON.parse(JSON.stringify(info.value.allergens)));
const tags = ref(JSON.parse(JSON.stringify(info.value.tags)));

let favorite = info.value.favorite;
function checkboxClick(event) {
	favorite = !favorite;
}

// Creates values for switching allergens and tags to and from edit mode
const allergensEdit = ref(false);
function closeAllergenEdit(event) {
	allergensEdit.value = false;
}
const tagsEdit = ref(false);
function closeTagEdit(event) {
	tagsEdit.value = false;
}

// Stuff for the delete function and it's modal
let modal;
function deleteModal() {
	modal = document.getElementById("deleteModal");
	console.log("DeleteConfirm");
	modal.showModal();
}
function closeModal() {
	modal.close();
}
let deleted = false;
const deletedEvent = new Event('deleted', { bubbles: true });
function deleteConfirmed(event) {
	modal.close();
	deleted = true;
	event.target.dispatchEvent(deletedEvent);
	document.getElementsByClassName(`${info.value.barcode} item`)[0].setAttribute('style', 'display: none');
	syncToStore();
}

// Provides spaces after commas
function parseTags(tags) {
	tags = tags.replaceAll(",", ", ");
	return tags;
}
</script>

<template>
	<div class="editable panel" v-bind:class="info.barcode">
		<td colspan="3">
			<table>
				<table>
					<thead class="panelHeader">
						<th>Name</th>
						<th>Number</th>
						<th>Favorite</th>
						<th>Delete</th>
					</thead>
					<tbody class="panelBody">
						<td class="namePanel"><input type="text" class="name" v-bind:placeholder="info.given_name" size="1"
								pattern="[^\s\t\n\r\{\}\\\[\]]([^\t\n\r\{\}\\\[\]]?)+" /></td>
						<td class="numberPanel"><input type="number" class="number" v-bind:value="info.number" min="0" size="1">
						</td>
						<td class="favoritePanel"><input type="checkbox" class="favorite" v-bind:checked="info.favorite"
								@change="checkboxClick" /></td>
						<td class="delete bi-trash-fill" @click="deleteModal"></td>
						<dialog id="deleteModal">
							<h3>Really Delete?</h3>
							<button @click="deleteConfirmed">Yes</button>
							<button @click="closeModal">No</button>
						</dialog>
					</tbody>
				</table>
				<table>
					<thead class="panelHeader">
						<th>Barcode</th>
						<th>OFF Name</th>
						<th>Allergens</th>
						<th>Tags</th>
						<th>Save</th>
					</thead>
					<tbody class="panelBody">
						<td class="barcode">{{ info.barcode }}</td>
						<td class="off_name">{{ info.off_name }}</td>
						<td class="allergens expanded" v-if="allergensEdit">
							<ListEditor v-bind:type="'allergens'" v-bind:list="allergens" @close-button="closeAllergenEdit" />
						</td>
						<td class="allergens" @click="allergensEdit = !allergensEdit" v-else>{{ parseTags(allergens.toString()) }}
						</td>
						<td class="tags expanded" v-if="tagsEdit">
							<ListEditor v-bind:type="'tags'" v-bind:list="tags" @close-button="closeTagEdit" />
						</td>
						<td class="tags" @click="tagsEdit = !tagsEdit" v-else>{{ parseTags(tags.toString()) }}</td>
						<td><button class="edit bi-pencil-square" @click.prevent="saveClick"></button></td>
					</tbody>
				</table>
			</table>
		</td>
	</div>
</template>

<style scoped>
table {
	width: 100%;
	border-collapse: collapse;
}

td {
	height: 2rem;
}

input {
	background-color: white;
	width: 80%;
	padding: .05rem;
}

input:invalid {
	background-color: lightpink;
}

.panel {
	display: table-row;
	background-color: var(--panel-color);
	transition: all .2s;
}

.panelHeader {
	background-color: var(--panel-header-color);
	transition: all .2s;
}

.numberPanel,
.favoritePanel,
.delete {
	width: 4rem;
}

.barcode,
.off_name {
	background-color: var(--accent-dark-grey);
	transition: all .2s;
}

.allergens,
.tags,
.delete {
	max-width: 35%;
	cursor: pointer;
	transition: all .2s;
}

.delete {
	font-size: 2rem;
	color: white;
}

.expanded {
	vertical-align: top;
}

.edit {
	display: table-cell;
	width: 100%;
	color: white;
	background-color: var(--item-active);
	font-size: 2rem;
	cursor: pointer;
	transition: all .2s;
	border: none;
}

.allergens:hover,
.tags:hover,
.edit:hover,
.delete:hover {
	background-color: var(--item-hover);
}

.allergens:active,
.tags:active,
.edit:active,
.delete:active {
	background-color: var(--item-active);
}

#deleteModal {
	background-color: var(--panel-color);
}

#deleteModal>button {
	margin: .8rem;
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
	border-right: solid 1px;
}
</style>