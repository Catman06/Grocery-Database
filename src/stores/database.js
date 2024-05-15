import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { loadTable } from "@/database_interaction/dbAccess";

export const useDatabaseStore = defineStore('database', () => {
	//// States
	const items = ref(undefined);
	const selected = ref(undefined);
	//// Getters

	//// Actions
	// Returns the item with the passed barcode.
	function getItemByCode(barcode) {
		const item = items.value.find((item) => item.barcode == barcode);
		return item;
	}

	//Returns a list of all tags or allergens depending on the option passed
	function tagList(type) {
		let tags = [];
		if (type == 'allergens') {
			// For each item
			this.items.forEach(item => {
				// For each allergen
				item.allergens.forEach(tag => {
					if (!tags.includes(tag)) {
						tags.push(tag);
					}
				});
			});
		} else if (type == 'tags') {
			// For each item
			this.items.forEach(item => {
				// For each allergen
				item.tags.forEach(tag => {
					if (!tags.includes(tag)) {
						tags.push(tag);
					}
				});
			});
		}
		return tags;
	}

	// Updates the store
	async function update() {
		this.items = await loadTable();
	}

	return { items, selected, getItemByCode, tagList, update };

})