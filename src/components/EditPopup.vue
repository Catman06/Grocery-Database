<script setup>
const props = defineProps(['info']);
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