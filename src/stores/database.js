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

	return { items, selected, getItemByCode };

})