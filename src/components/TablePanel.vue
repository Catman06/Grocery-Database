<script setup>
const props = defineProps(['info']);

// When the edit button gets clicked, send an event up the DOM
const editButtonEvent = new Event('edit-clicked', { bubbles: true });
function editClick(event) {
	if (event.key != 'Enter' && event.type != 'click' && event.key != ' ') { return }
	// Ensures it doesn't matter if the image or div is what was clicked
	let tdTarget = event.target;
	if (tdTarget.className != 'edit') {
		tdTarget = tdTarget.parentElement;
	}
	tdTarget.dispatchEvent(editButtonEvent);
}

// Provides spaces after commas
function parseTags(tags) {
	tags = tags.replaceAll(",", ", ");
	return tags;
}
</script>

<template>
	<div class="panel" v-bind:class="info.barcode">
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
					<td class="barcode">{{ info.barcode }}</td>
					<td class="off_name">{{ info.off_name }}</td>
					<td class="allergens">{{ parseTags(info.allergens.toString()) }}</td>
					<td class="tags">{{ parseTags(info.tags.toString()) }}</td>
					<td class="edit bi-pencil-square" @click="editClick" @keydown="editClick" tabindex="0"></td>
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

tbody>td {
	padding: 0.2rem;
}

.panel {
	display: table-row;
	background-color: var(--panel-color);
}

.panelHeader {
	background-color: var(--panel-header-color);
}

.barcode {
	overflow-wrap: anywhere;
}

.allergens {
	max-width: 35%;
}

.tags {
	max-width: 35%;
}

.edit {
	font-size: 2rem;
	transition: all .2s;
}

.edit:hover {
	background-color: var(--item-hover);
	cursor: pointer;
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