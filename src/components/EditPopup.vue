<script setup>
import { useDatabaseStore } from '@/stores/database';
import { ref, watch } from 'vue';
const selected = ref(useDatabaseStore().selected);
let info = ref(useDatabaseStore().getItemByCode(selected.value));

useDatabaseStore().$subscribe(checkSelected);

function checkSelected(event) {
	selected.value = useDatabaseStore().selected;
	info = ref(useDatabaseStore().getItemByCode(selected.value));
	console.log(selected.value);
}
new Event('close-edit-panel');
</script>

<template>
	<div id="popup">
		<button id="closeButton"@click="$emit('close-edit-panel')">Close</button>
		<div id="changeNum">Selected: {{ selected }}</div>
		<div id="changeNum">Number: {{ info.number }}</div>
		<div id="changeName">Name: {{ info.given_name }}</div>
		<div id="toggleFav">Fav: {{ info.favorite }}</div>
		<div id="changeAllergens">Allergens: {{ info.allergens }}</div>
		<div id="changeTags">Tags: {{ info.tags }}</div>
		<div id="deleteItem">Delete</div>
	</div>
</template>

<style scoped>
div {
	background-color: var(--panel-color);
	border-radius: 20px;
	border: 4px solid black;
	padding: .5rem 1rem;
	margin: 1rem auto;
	width: fit-content;
}
.popup {
	position: fixed;
	bottom: 0;
	left: 0;
}
</style>