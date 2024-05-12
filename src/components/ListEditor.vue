<script setup>
import { useDatabaseStore } from '@/stores/database';
import { ref } from 'vue';
const props = defineProps(['type', 'list']);
const fullTagList = ref(useDatabaseStore().tagList(props.type));
console.log(fullTagList.value);

function remove(tag) {
	const i = props.list.indexOf(tag);
	try {
		props.list.splice(i, 1);
	} catch (error) {
		console.error(error);
	}
}

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
		<button id='closeButton' @click="close">Close</button>
		<div class="addTag">
			<input v-bind:id="'new'+type" type="text" placeholder="New Tag" v-bind:list="type+'datalist'">
			<button id='addButton' class="bi-plus" @click="add" />
		</div>
		<li class="dropdownContentWrapper" v-for="tag in list">
			<div class="dropdownContent">
				{{ tag }}
				<button class="bi-trash" @click="remove(tag)" />				
			</div>
		</li>
		<datalist v-bind:id="type+'datalist'">
			<option v-for="tag in fullTagList" v-bind:value='tag' />
		</datalist>
	</td>

</template>

<style scoped>
.dropdown {
	position: relative;
	display: block;
	z-index: 1;
	overflow: visible;
	background-color: var(--panel-color);
}

.addTag {
	position: relative;
	z-index: 1;
	background-color: inherit;
	padding-bottom: .2rem;
}

#closeButton {
	display: block;
	padding: .4rem;
	border-radius: 0px 0px 5px 0px;
	background-color: var(--accent-grey);
	border: none;
	transition: all .2s;
}
#closeButton:hover {
	background-color: var(--accent-light-grey);
}

#addButton {
	border-radius: 0px 15% 15% 0px;
}

button {
	display: inline-block;
	color: var(--font-color);
	background-color: var(--accent-grey);
	border-radius: 15%;
	transition: all .2s;
	padding: 2px 4px;
	border: none;
}
button:hover {
	background-color: var(--accent-light-grey);
}
button:active {
	background-color: var(--accent-dark-grey);
}


.dropdownContentWrapper {
	z-index: 1;
	padding: 0.1rem 0rem;
	background-color: inherit;
	list-style: none;
}

.dropdownContentWrapper:last-of-type {
	border-radius: 0px 0px 10px 10px;
	padding-bottom: 1rem;
}

.dropdownContent {
	background-color: grey;
	width: fit-content;
	margin: auto;
	padding: .1rem 1rem;
	border-radius: .4rem;
}
</style>