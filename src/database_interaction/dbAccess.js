export async function loadTable() {
	console.log('Loading Table');
	const headers = [
		['Goal', 'get-table']
	];
	let response = await fetch("dbAccess.php", {
		headers: headers
	});
	response = await response.json()

	//Fix decode allergens and tags
	response.table.forEach(item => {
		item.allergens = JSON.parse(item.allergens);
		item.tags = JSON.parse(item.tags);
	});

	try {
		response = response.table;
	} catch (error) {
		throw new Error("DB response malformed" + response);
	}
	

	if (response.error) {
		console.error('PHP Error:' + response.error);
		return;
	}
	console.log(response);
	return response;
}

export async function updateItem(item) {
	const headers = [
		['Goal', 'update']
	];
	
	const body = item;

	let response = await fetch("dbAccess.php", {
		method: "POST",
		headers: headers,
		body: body
	});
	
	response = await response.json()

	if (response.error) {
		console.error('PHP Error:' + response.error);
		return;
	}
	console.log(response);
	return response;
}