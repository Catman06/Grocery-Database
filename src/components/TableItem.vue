<script setup>
import TablePanel from '../components/TablePanel.vue';
import { ref } from "vue";
const props = defineProps(['info']);

// Sets favTxt to * if the item is a favorite
let favTxt = "";
if (props.info.favorite == true) {
	favTxt = "*";
}

const panel = ref(false);


// Toggles the panel, emitting an event to close all others
const panelEvent = new Event('toggle-panel', { bubbles: true });
function togglePanel(event) {
	if (event.key != 'Enter' && event.type != 'click') {
		return;
	}
	
	event.target.dispatchEvent(panelEvent);
	panel.value = !panel.value;
}

function closePanel(event) {
	panel.value = false;
}
</script>

<template>
	<tr v-bind:class="info.code" class="item" role="button" aria-expanded="false" tabindex="1" @click="togglePanel" @keydown="togglePanel" @close-panel="closePanel">
		<td class="name">{{ info.given_name }}</td>
		<td>{{ info.number }}</td>
		<td class="favorite">{{ favTxt }}</td>
	</tr>
	<!-- Only Shows if 'panel' is true -->
	<TablePanel v-if="panel" rowspan="3" :info="info" />
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