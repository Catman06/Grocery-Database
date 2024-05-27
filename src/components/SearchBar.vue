<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useDatabaseStore } from "@/stores/database";

const { current_filter } = storeToRefs(useDatabaseStore());
function setQuery() {
	current_filter.value.code = code.value;
	current_filter.value.given_name = given_name.value;
	current_filter.value.off_name = off_name.value;
	current_filter.value.allergens = allergens.value;
	current_filter.value.tags = tags.value;
	current_filter.value.text = document.getElementById('query').value;
}

//// Dropdown Menu
const open = ref(false);
// variables for storing the state of each checkbox
const code = ref(true);
const given_name = ref(true);
const off_name = ref(true);
const allergens = ref(true);
const tags = ref(true);


function toggleDropdown(event) {
	if (event.key != 'Enter' && event.type != 'click' && event.key != ' ') { return };
	open.value = !open.value;
	if (open.value) {
		document.getElementById("searchOptionToggle").classList.remove("bi-caret-right");
		document.getElementById("searchOptionToggle").classList.add("bi-caret-down");
	} else {
		document.getElementById("searchOptionToggle").classList.remove("bi-caret-down");
		document.getElementById("searchOptionToggle").classList.add("bi-caret-right");
	}
}
</script>

<template>
	<div id="searchWrapper">
		<form @submit.prevent="setQuery">
			<button id="searchOptionToggle" class="bi-caret-right" @click="toggleDropdown" @keydown="toggleDropdown" tabindex="0"></button>
			<div id="searchOptions" class="dropdown">
				<div class="dropdownContent" v-show="open">
					<input type="checkbox" id="searchCode" checked="true" @change="code = !code"/>
					<label for="searchCode">Barcode</label><br>
					<input type="checkbox" id="searchName" checked="true" @change="given_name = !given_name"/>
					<label for="searchName">Name</label><br>
					<input type="checkbox" id="searchOFF" checked="true" @change="off_name = !off_name"/>
					<label for="searchOFF">OFF Name</label><br>
					<input type="checkbox" id="searchAllergens" checked="true" @change="allergens = !allergens"/>
					<label for="searchAllergens">Allergens</label><br>
					<input type="checkbox" id="searchTags" checked="true" @change="tags = !tags"/>
					<label for="searchTags">Tags</label>
				</div>
			</div>
			<label for="query" class="hidden">Search Box</label>
			<input id="query" type="text" placeholder="Search"/>
			<button id="searchSubmit" type="submit" class="bi-search" aria-label="Search Button"></button>
		</form>
	</div>
</template>

<style scoped>
#searchWrapper {
	margin: auto;
}

#searchSubmit {
	border: solid 1px var(--accent-dark-grey);
	border-radius: 0px 5px 5px 0px;
	padding: 2px 8px;
}

.dropdown {
	position: absolute;
	z-index: 1;
}
.dropdownContent {
	background-color: var(--panel-color);
	display: block;
	position: relative;
	padding: 5px;
  border-radius: 5px;
}
</style>