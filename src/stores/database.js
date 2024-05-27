import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { loadTable } from "@/database_interaction/dbAccess";

export const useDatabaseStore = defineStore('database', () => {
	//// States
	const items = ref(undefined);
	const selected = ref(undefined);
	const current_sort = ref({
		sort: undefined,
		reversed: false,
	});
	const current_filter = ref('');

	//// Getters
	// Provides the items as defined by the search query
	const filtered_items = computed(() => {
		let query = current_filter.value;
		// exact is true if the query is surrounded by single or double quotation marks
		let exact = (query.startsWith('"') || query.startsWith("'")) && (query.endsWith('"') || query.endsWith("'"));
		// regex is true if the query is surrounded by slashes, with allowance for ending flags
		let regex = query.search(/^\/.+\/[gimsuy]{0,6}/) >= 0;

		// Build the search's Regex pattern
		let pattern;
		if (exact) {
			// Case-Sensitive
			query = RegExp(/"(.+)"/).exec(query)[1];
			pattern = new RegExp(query);
		} else if (regex) {
			// query is Regex
			let flags = RegExp(/\/([gimsuy]{0,6})$/).exec(query)[1];
			query = RegExp(/\/(.+)\//).exec(query)[1];
			pattern = new RegExp(query, flags);
		} else {
			// Normal Case-Insensetive
			pattern = new RegExp(query, "i");
		}

		return items.value.filter((item) => {
			let barcode = item.barcode;
			let given_name = item.given_name;
			let off_name = item.off_name;
			let allergens = item.allergens.toString();
			let tags = item.tags.toString();

			// Check using the pattern
			if (0 <= barcode.search(pattern) ||
				0 <= given_name.search(pattern) ||
				0 <= off_name.search(query) ||
				0 <= allergens.search(pattern) ||
				0 <= tags.search(pattern)) {
				return true;
			} else {
				return false;
			}
		})
	});

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
		try {
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
		} catch (error) {
			console.error(`Failed to get tag list: ${error}`);
			return new Array;
		}
	}

	// Sorting
	function sortTable(sort) {
		console.log("Sorting by " + sort);
		switch (sort) {
			case 'given_name':
				this.current_sort.sort = sort;
				this.items.sort(given_name);
				break;

			case 'number':
				this.items.sort(number);
				this.current_sort.sort = sort;
				break;

			case 'favorite':
				this.items.sort(favorite);
				this.current_sort.sort = sort;
				break;

			case 'reverse':
				this.items.reverse();
				this.current_sort.reverse = !this.current_sort.reversed;
				break;

			default:
				break;
		}
	}


	// Updates the store
	async function update() {
		this.items = await loadTable();
		this.sortTable(this.current_sort.sort);
	}

	return { items, selected, current_sort, current_filter, filtered_items, getItemByCode, tagList, sortTable, update };

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