<script setup>
import { useDatabaseStore } from '@/stores/database';
const selected = useDatabaseStore().selected;

if (selected == 'none') {
	const info = useDatabaseStore().getItemByCode(1);
} else if (selected == true) {
	const info = useDatabaseStore().getItemByCode(props.selected.value);
} else {
	console.error(selected);
}

console.log(info);
</script>

<template>
	<div id="popup">
		<div id="changeNum">{{ info.number }}</div>
		<div id="changeName">{{ info.given_name }}</div>
		<div id="toggleFav">{{ info.favorite }}</div>
		<div id="changeAllergens">{{ info.allergens }}</div>
		<div id="changeTags">{{ info.tags }}</div>
		<div id="deleteItem"></div>
	</div>
</template>