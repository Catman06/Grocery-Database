<script setup>
import { useDatabaseStore } from '@/stores/database';
import { ref } from 'vue';
const props = defineProps(['type']);
const fullTagList = ref(useDatabaseStore().tagList(props.type))
const selected = ref(useDatabaseStore().selected);
// Get the list of tags or allergens
const tags = ref();
if (props.type == 'allergens') {
	tags.value = useDatabaseStore().getItemByCode(selected.value).allergens;
} else {
	tags.value = useDatabaseStore().getItemByCode(selected.value).tags;
}

</script>

<template>
	<td class="dropdown">
		<div class="addTag">
			<button>+</button>
			<input type="text" placeholder="New Tag">
		</div>
		<div class="dropdownContent" v-for="tag in tags">
			<input v-bind:name='tag' type="checkbox" checked="true">
			<label v-bind:for='tag'>{{ tag }}</label>
		</div>
		<datalist id="datalist">
			<option v-for="tag in fullTagList" v-bind:value='tag'/>
		</datalist>
	</td>

</template>

<style scoped>
.dropdown {
	display: flex;
	overflow: visible;
	flex-direction: column;
	background-color: var(--panel-color);

}

.dropdownContent {
	z-index: 1;
	background-color: inherit;
}

.dropdownContent:last-of-type {
	border-radius: 0px 0px 10px 10px;}
</style>