<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useDatabaseStore } from "@/stores/database";

const { current_filter } = storeToRefs(useDatabaseStore());
function setQuery() {
	current_filter.value = document.getElementById('query').value;
}
</script>

<template>
	<div id="searchWrapper">
		<form @submit.prevent="setQuery">
			<label for="query" class="hidden">Search Box</label>
			<input id="query" type="text" placeholder="Search"/>
			<button type="submit" class="bi-search" aria-label="Search Button"></button>
		</form>
	</div>
</template>

<style scoped>
#searchWrapper {
	margin: auto;
}

#searchWrapper button {
	border: solid 1px var(--accent-dark-grey);
	border-radius: 0px 5px 5px 0px;
	padding: 2px 8px;
}
</style>