<script setup>
import init, { search } from '@/rust/pkg/rust_functions.js';
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useDatabaseStore } from "@/stores/database";

const { items } = storeToRefs(useDatabaseStore());

</script>

<template>
	<div id="searchWrapper">
		<form @submit.prevent="">
			<input id="query" type="text" />
			<button type="submit" class="bi-search"></button>
		</form>
	</div>
</template>