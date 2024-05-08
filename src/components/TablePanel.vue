<script setup>
const props = defineProps(['info']);

const editButtonEvent = new Event('edit-clicked', { bubbles: true });

function editClick(event) {
	let tdTarget = event.target;
	if (tdTarget.className != 'edit') {
		tdTarget = tdTarget.parentElement;
	}
	tdTarget.dispatchEvent(editButtonEvent);
}
</script>

<template>
	<tr class="panel" v-bind:class="info.code">
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
	</tr>

</template>

<style scoped>
table {
	width: 100%;
	border-collapse: collapse;
}

.panel {
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
	background-color: var(--panel-color);
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
  border-right: solid 1px;
}
</style>