<script setup>
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';
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
	info.value.changed = true;
	info.value.given_name = panel.querySelector('.name').innerHTML;
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
					</thead>
					<tbody class="panelBody">
						<td class="name" contenteditable="true">{{ info.given_name }}</td>
						<td class="number">{{ info.number }}</td>
						<td class="favorite">{{ info.favorite }}</td>
					</tbody>
				</table>
				<table>
					<thead class="panelHeader">
						<th>Barcode</th>
						<th>OFF Name</th>
						<th>Allergens</th>
						<th>Tags</th>
						<th>Edit</th>
					</thead>
					<tbody class="panelBody">
						<td class="barcode">{{ info.code }}</td>
						<td class="off_name">{{ info.off_name }}</td>
						<td class="allergens">{{ info.allergens.toString() }}</td>
						<td class="tags">{{ info.tags.toString() }}</td>
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

.panel {
	display: table-row;
	background-color: var(--panel-color);
}

.panelHeader {
	background-color: var(--panel-header-color);
}

.allergens {
	max-width: 35%;
}

.tags {
	max-width: 35%;
}

.edit {
	background-color: var(--item-active);
}

.allergens:hover,
.tags:hover,
.name:hover,
.number:hover,
.favorite:hover {
	background-color: var(--item-hover);
}

.allergens:active,
.tags:active,
.name:active,
.number:active,
.favorite:active {
	background-color: var(--item-active);
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
	border-right: solid 1px;
}
</style>