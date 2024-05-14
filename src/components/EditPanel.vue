<script setup>
import ListEditor from './ListEditor.vue';
import { useDatabaseStore } from '@/stores/database';
import { ref, watch } from 'vue';
const selected = ref(useDatabaseStore().selected);
let info = ref(useDatabaseStore().getItemByCode(selected.value));

// When edit is clicked, sync any changes to the store then sen the edit-clicked event
const editButtonEvent = new Event('edit-clicked', { bubbles: true });
function editClick(event) {
	// Ensures it doesn't matter if the image or div is what was clicked
	let tdTarget = event.target;
	if (tdTarget.className != 'edit') {
		tdTarget = tdTarget.parentElement;
	}
	syncToStore();
	tdTarget.dispatchEvent(editButtonEvent);
}

// Sync any potential changes to useDatabaseStore along with 'deleted' set to signal a change has potentially been made
function syncToStore() {
	try {
		let panel = document.querySelector('.editable');
		info.value.changed = true;
		info.value.deleted = deleted;
		info.value.given_name = panel.querySelector('.name').value;
		info.value.number = panel.querySelector('.number').value;
		info.value.favorite = favorite;
		info.value.allergens = allergens.value;
		info.value.tags = tags.value;
	} catch (error) {
		console.error(`Failed to sync to the store: ${error}`);
	}
}
// Creates a local deep copy for holding temporary changes to the arrays
const tags = ref(JSON.parse(JSON.stringify(info.value.tags)));
const allergens = ref(JSON.parse(JSON.stringify(info.value.allergens)));

let favorite = info.value.favorite;
function checkboxClick(event) {
	favorite = !favorite;
}

const allergensEdit = ref(false);
function toggleAllergenEdit(event) {
	allergensEdit.value = false;
}
const tagsEdit = ref(false);
function toggleTagEdit(event) {
	tagsEdit.value = false;
}

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
	document.getElementsByClassName(`${info.value.code} item`)[0].setAttribute('style', 'display: none');
	syncToStore();
}
</script>

<template>
	<div class="editable panel" v-bind:class="info.code">
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
						<td><input type="text" class="name" v-bind:value="info.given_name" /></td>
						<td><input type="number" class="number" v-bind:value="info.number" /></td>
						<td><input type="checkbox" class="favorite" v-bind:checked="info.favorite" @change="checkboxClick" /></td>
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
						<td class="barcode">{{ info.code }}</td>
						<td class="off_name">{{ info.off_name }}</td>
						<td class="allergens expanded" v-if="allergensEdit">
							<ListEditor v-bind:type="'allergens'" v-bind:list="allergens" @close-button="toggleAllergenEdit" />
						</td>
						<td class="allergens" @click="allergensEdit = !allergensEdit" v-else>{{ allergens.toString() }}</td>
						<td class="tags expanded" v-if="tagsEdit">
							<ListEditor v-bind:type="'tags'" v-bind:list="tags" @close-button="toggleTagEdit" />
						</td>
						<td class="tags" @click="tagsEdit = !tagsEdit" v-else>{{ tags.toString() }}</td>
						<td class="edit bi-pencil-square" @click="editClick"></td>
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
	display: table-cell;
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
	color: white;
	background-color: var(--item-active);
	font-size: 2rem;
	cursor: pointer;
	transition: all .2s;
}

.allergens:hover,
.tags:hover,
.name:hover,
.number:hover,
.favorite:hover,
.edit:hover,
.delete:hover {
	background-color: var(--item-hover);
}

.allergens:active,
.tags:active,
.name:active,
.number:active,
.favorite:active,
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