<script setup>
import { loadTable } from '@/database_interaction/dbAccess';
import TableItem from '../components/TableItem.vue';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

await useDatabaseStore().update();
const { items, selected } = storeToRefs(useDatabaseStore());
console.log("'items' Loaded");
console.log(items);

// Takes the toggle-panel event and sends a close-panel event to all children but the one the initial event came from
const closePanel = new Event('close-panel');
function closeEventRedirect(event) {
	// Sets event target to the correct tr element. Needed for keyboard functionality
	let eventTarget;
	if (event.target.tagName == 'TD') {
		eventTarget = event.target.parentElement;
	} else if (event.target.tagName == 'TR') {
		eventTarget = event.target;
	}
	// Sends a close-panel event to all items but the one that was clicked
	Array.from(document.getElementsByClassName('item')).forEach(item => {
		if (eventTarget != item) {
			item.dispatchEvent(closePanel);
			item.setAttribute('aria-expanded', false);
		} else {
			// If the clicked item is the expanded one, un-expand it
			if (item.getAttribute('aria-expanded') == 'true') {
				item.setAttribute('aria-expanded', false);	
			} else {
				item.setAttribute('aria-expanded', true);				
			}
		}
	});
	
	// Set 'selected' to the clicked item's code for the store
	let dbItem;
	dbItem = useDatabaseStore().getItemByCode(eventTarget.classList.item(0));
	selected.value = dbItem.barcode;
}

import { updateItem } from '@/database_interaction/dbAccess';
async function testPHP() {
	let allergens = ["allergen 1", "allergen 2"];
	let tags = ["tag 1", "tag 2", "tag 3"];
	let itemForm = new FormData();
	itemForm.append("barcode", Math.floor(Math.random() * 1000000000000));
	itemForm.append("given_name", 'Name');
	itemForm.append("off_name", 'Name');
	itemForm.append("number", 1);
	itemForm.append("allergens", JSON.stringify(allergens));
	itemForm.append("tags", JSON.stringify(tags));
	itemForm.append("favorite", false);
	itemForm.append("deleted", false);
	
	
	// Update the database
	updateItem(itemForm)
		.then(() => useDatabaseStore().update())
		.then(() => console.log('Added new item'))
		.catch((error) => console.error(error));
}

let current_sort = 'given_name';
function sortTable(sort) {
	if (current_sort == sort) {
		useDatabaseStore().sortTable('reverse');
	} else {
		current_sort = sort;
		useDatabaseStore().sortTable(sort);
	}
}

</script>

<template>
	<div>
		<button @click="testPHP">Test PHP</button>
		<div>{{ selected }}</div>
		<table id="mainTable" class="table">
			<thead>
				<th @click="sortTable('given_name')">Name</th>
				<th @click="sortTable('number')">Number</th>
				<th @click="sortTable('favorite')">Favorite</th>
			</thead>
			<tbody @toggle-panel="closeEventRedirect">
					<TableItem v-for="info in items" :key="info.barcode":info="info" />
			</tbody>
		</table>
	</div>

</template>

<style>
/* Table */
.table {
	--table-border-style: solid;
	--table-border-width: 3px;
	--table-border-color: var(--accent-green);

	text-align: center;
	width: 98%;
	max-width: 1028px;
	margin: 2rem auto;
	border-radius: 10px;
	border-spacing: 0;
	border: var(--table-border-width) var(--table-border-style) var(--table-border-color);
}

thead {
	background-color: var(--accent-green);
}

/* TableItems are classed 'item' */
.item {
	background-color: var(--accent-grey);
	transition: all .2s;
}

.item:nth-of-type(even) {
	background-color: var(--accent-light-grey);
}

.item>* {
	padding: 5px;
}

.item[aria-expanded='true'] {
	background-color: var(--panel-color);
}

@media (hover: hover) {
	.item:hover {
		background-color: var(--item-hover);
	}

	.item:active {
		background-color: var(--item-active);
	}
}

/* Horizontal Display */
@media (min-width: 1024px) {}
</style>