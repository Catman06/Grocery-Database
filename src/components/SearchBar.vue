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
			<input id="query" type="text" />
			<button type="submit" class="bi-search"></button>
		</form>
	</div>
</template>

<style scoped>

</style>