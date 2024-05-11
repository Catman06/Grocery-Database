<script setup>
import { useDatabaseStore } from '@/stores/database';
import { ref } from 'vue';
const props = defineProps(['type', 'list']);
const fullTagList = ref(useDatabaseStore().tagList(props.type))

function remove(tag) {
	const i = props.list.indexOf(tag);
	try {
		props.list.splice(i, 1);
	} catch (error) {
		console.error(error);
	}
}
console.log(props.list);
function add() {
	try {
		let newTag = document.getElementById(`new${props.type}`).value;
		props.list.push(newTag);
	} catch (error) {
		console.error(error);
	}
}



const emit = defineEmits(['close-button']);
function close(event) {
	emit('close-button');

}
</script>

<template>
	<td class="dropdown">
		<div class="addTag">
			<button @click="add">+</button>
			<input v-bind:id="'new'+type" type="text" placeholder="New Tag">
			<button @click="close">Close</button>
		</div>
		<li class="dropdownContent" v-for="tag in list">
			{{ tag }}
			<button @click="remove(tag)">X</button>
		</li>
		<datalist id="datalist">
			<option v-for="tag in fullTagList" v-bind:value='tag' />
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

.addTag {
	z-index: 1;
}

.dropdownContent {
	z-index: 1;
	background-color: inherit;
	list-style: none;
}

.dropdownContent:last-of-type {
	border-radius: 0px 0px 10px 10px;
}
</style>