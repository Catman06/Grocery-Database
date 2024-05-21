<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useDatabaseStore } from "@/stores/database";

const { filtered_items, current_filter } = storeToRefs(useDatabaseStore());
function setQuery() {
	current_filter.value = document.getElementById('query').value;
	console.log(current_filter.value);
	console.log(filtered_items.value);
}
</script>

<template>
	<div id="searchWrapper">
		<form @submit.prevent="setQuery">
			<input id="query" type="text" />
			<button type="submit" class="bi-search"></button>
		</form>
	</div>
</template>