export async function loadTable() {
	console.log('Loading Table');
	const headers = [
		['Goal', 'get-table']
	];
	let response = await fetch("dbAccess.php", {
		headers: headers
	});
	response = await response.json()

	if (response.error) {
		console.error('PHP Error:' + response.error);
		return;
	}
	console.log(response);
	return response;
}