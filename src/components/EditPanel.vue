<script setup>
import ListEditor from './ListEditor.vue';
import { useDatabaseStore } from '@/stores/database';
import { ref, watch } from 'vue';
const selected = ref(useDatabaseStore().selected);
let info = ref(useDatabaseStore().getItemByCode(selected.value));

// When edit is clicked, sync any changes to the store then sen the edit-clicked event
const editButtonEvent = new Event('edit-clicked', { bubbles: true });
function editClick(event) {
	// Ensures it doensn't matter if the image or div is what was clicked
	let tdTarget = event.target;
	if (tdTarget.className != 'edit') {
		tdTarget = tdTarget.parentElement;
	}
	syncToStore();
	tdTarget.dispatchEvent(editButtonEvent);
}

// Sync any potential changes to useDatabaseStore along with 'changed' set to true
function syncToStore() {
	let panel = document.querySelector('.editable');
	console.debug('before');
	console.debug(info.value);
	info.value.changed = true;
	info.value.given_name = panel.querySelector('.name').value;
	info.value.number = panel.querySelector('.number').value;
	info.value.favorite = favorite;
	// info.value.allergens = panel.querySelector('.allergens').value;
	// info.value.tags = panel.querySelector('.tags').value;
	console.debug('after');
	console.debug(info.value);
}

let favorite = info.value.favorite;
function checkboxClick(event) {
	favorite = !favorite;
}

const allergensEdit = ref(false);
function toggleAllergenEdit(event) {
	console.log(event);
}
const tagsEdit = ref(false);
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
					</thead>
					<tbody class="panelBody">
						<td><input type="text" class="name" v-bind:value="info.given_name"/></td>
						<td><input type="number" class="number" v-bind:value="info.number"/></td>
						<td><input type="checkbox" class="favorite" v-bind:checked="info.favorite" @change="checkboxClick"/></td>
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
						<td class="allergens" @click="toggleAllergenEdit" v-if="allergensEdit">
							<ListEditor v-bind:type="'allergens'"/>
						</td>
						<td class="allergens" @click="allergensEdit = !allergensEdit" v-else>{{ info.allergens.toString() }}</td>
						<td class="tags" @click="toggleTagsEdit" v-if="tagsEdit">
							<ListEditor v-bind:type="'tags'"/>
						</td>
						<td class="tags" @click="tagsEdit = !tagsEdit" v-else>{{ info.tags.toString() }}</td>
						<td class="edit" @click="editClick"><img src="/favicon.ico"></td>
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
}

.panelHeader {
	background-color: var(--panel-header-color);
}

.barcode {
	background-color: var(--accent-dark-grey);
}

.off_name {
	background-color: var(--accent-dark-grey);
}

.allergens {
	max-width: 35%;
	cursor:pointer;
}

.tags {
	max-width: 35%;
	cursor:pointer;
}

.edit {
	background-color: var(--item-active);
	cursor:pointer;
}

.allergens:hover,
.tags:hover,
.name:hover,
.number:hover,
.favorite:hover,
.edit:hover {
	background-color: var(--item-hover);
}

.allergens:active,
.tags:active,
.name:active,
.number:active,
.favorite:active,
.edit:active {
	background-color: var(--item-active);
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
	border-right: solid 1px;
}
</style>