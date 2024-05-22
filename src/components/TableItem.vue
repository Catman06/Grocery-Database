<script setup>
import TablePanel from './TablePanel.vue';
import EditPanel from './EditPanel.vue';
import { onBeforeMount, ref, watch } from "vue";
import { useDatabaseStore } from '@/stores/database';
const props = defineProps(['info']);

const panel = ref(false);


// Toggles the panel, emitting an event to close all others
// if the panel is in edit mode, exit edit mode
const panelEvent = new Event('toggle-panel', { bubbles: true });
function togglePanel(event) {
	if (event.key != 'Enter' && event.type != 'click' && event.key != ' ') { return };

	event.target.dispatchEvent(panelEvent);
	if (edit.value == true) {
		edit.value = false;
		panel.value = false;
	} else {
		panel.value = !panel.value;
	}
}

function closePanel(event) {
	edit.value = false;
	panel.value = false;
}

// Replaces the normal display panel with the one for editing
const edit = ref(false);
function openEditPanel(event) {
	panel.value = false;
	edit.value = true;
}
function closeEditPanel(event) {
	console.log('closeEditPanel');
	panel.value = true;
	edit.value = false;
}
</script>

<template>
	<tr v-bind:class="info.barcode" class="item" role="button" aria-expanded="false" tabindex="0" @click="togglePanel"
		@keydown="togglePanel" @close-panel="closePanel">
		<td class="name">{{ info.given_name }}</td>
		<td>{{ info.number }}</td>
		<td class="favorite">{{ info.favorite ? '*' : '' }}</td>
	</tr>
	<slot></slot>
	<TablePanel v-if="panel" rowspan="3" :info="info" @edit-clicked="openEditPanel" />
	<EditPanel v-if="edit" @save-clicked="closeEditPanel" @deleted="closePanel" />
</template>

<style scoped>
.name {
	width: fit-content;
	min-width: 40%;
}

.favorite {
	width: 10%;
}

/* Adds horizontal dividers */
td:not(:last-of-type) {
	border-right: solid 1px;
}
</style>