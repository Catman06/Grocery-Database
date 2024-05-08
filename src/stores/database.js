import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import database from '@/assets/pretend_database.json';

export const useDatabaseStore = defineStore('database', () => {
	// States
	const items = ref(structuredClone(database.items));
	const selected = ref('none');
	// Getters

	// Actions
	function getItemByCode(code) {
		return items.value.find((item) => item.code == code);
	}

	return { items, selected, getItemByCode };

})