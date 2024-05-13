export async function loadTable() {
	const headers = [
		['goal', 'get_table']
	];
	let response = await fetch("/src/php/dbAccess.php", {
		headers
	});
}