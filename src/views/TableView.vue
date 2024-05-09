<script setup>
import TableItem from '../components/TableItem.vue'
import EditPopup from '@/components/EditPopup.vue';
import { useDatabaseStore } from '@/stores/database';
import { ref } from 'vue';

const items = useDatabaseStore().items;

// Takes the toggle-panel event and sends a close-panel event to all children but the one the inital event came from
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
			item.setAttribute("aria-expanded", true);
		}
	});
	
	// Set 'selected' to the clicked item's code for the store
	let dbItem;
	dbItem = useDatabaseStore().getItemByCode(eventTarget.classList.item(0));
	
	useDatabaseStore().selected = dbItem.code;
}
</script>

<template>
	<div>
		<table id="mainTable" class="table">
			<thead>
				<th>Name</th>
				<th>Number</th>
				<th>Favorite</th>
			</thead>
			<tbody @toggle-panel="closeEventRedirect">
				<TableItem v-for="info in items" :info="info" />
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
	width: 100%;
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