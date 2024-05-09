<script setup>
const props = defineProps(['info']);

// When the edit button gets clicked, send an event up the DOM
const editButtonEvent = new Event('edit-clicked', { bubbles: true });
function editClick(event) {
	// Ensures it doensn't matter if the image or div is what was clicked
	let tdTarget = event.target;
	if (tdTarget.className != 'edit') {
		tdTarget = tdTarget.parentElement;
	}
	tdTarget.dispatchEvent(editButtonEvent);
}
</script>

<template>
	<div class="panel" v-bind:class="info.code">
		<td colspan="3">
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

.edit:hover {
	background-color: var(--item-hover);
}
.edit:active {
	background-color: var(--accent-green);
}
.edit.selected:active {
	background-color: var(--item-active);
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
  border-right: solid 1px;
}
</style>