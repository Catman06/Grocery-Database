import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import database from '@/assets/pretend_database.json';

export const useDatabaseStore = defineStore('database', () => {
	//// States
	const items = ref(structuredClone(database.items));
	const selected = ref(undefined);
	//// Getters

	//// Actions
	// Returns the item with the passed barcode.
	function getItemByCode(code) {
		const item = items.value.find((item) => item.code == code);
		return item;
	}
	//TODO Returns a list of all tags or allergens depending on the option passed
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

	return { items, selected, getItemByCode, tagList };

})