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
		let item;
		try {
			item = items.value.find((item) => item.barcode == barcode);
			return item;
		} catch (error) {
			return undefined;
		}
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

	// Sorting
	function sortTable(sort) {
		console.log("Sorting by " + sort);
		switch (sort) {
			case 'given_name':
				this.items.sort(given_name);
				break;

			case 'number':
				this.items.sort(number);
				break;

			case 'favorite':
				this.items.sort(favorite);
				break;

			case 'reverse':
				this.items.reverse();
				break;

			default:
				break;
		}
	}




	// Updates the store
	async function update() {
		this.items = await loadTable();
		this.sortTable('given_name');
	}

	return { items, selected, getItemByCode, tagList, sortTable, update };

})

//// Sorts
function given_name(a, b) {
	try {
		a = a.given_name.toUpperCase();
		b = b.given_name.toUpperCase();
		let c;
		let d;

		let same = true;
		let i = 0;
		while (same == true) {
			c = a.charCodeAt(i);
			d = b.charCodeAt(i);

			if (c != d) {
				break;
			}
			i++;
		}

		return c - d || isNaN(d) - isNaN(c);
	} catch (e) {
		throw new Error(e);
	}
}

function number(a, b) {
	try {
		a = a.number;
		b = b.number;

		if (a > b) {
			return -1;
		} else if (a == b) {
			return 0;
		} else if (b > a) {
			return 1;
		}
	} catch (e) {
		throw new Error(e);
	}
}

function favorite(a, b) {
	try {
		a = a.favorite;
		b = b.favorite;

		if (a && !b) {
			return -1;
		} else if (a == b) {
			return 0;
		} else if (!a && b) {
			return 1;
		}
	} catch (e) {
		throw new Error(e);
	}
}