<?php
// From PHP.net, converts error reports to exceptions for ease of debugging
function exceptions_error_handler($severity, $message, $filename, $lineno)
{
	throw new ErrorException($message, 0, $severity, $filename, $lineno);
}
set_error_handler('exceptions_error_handler');


// A global catch block for anything not previously caught
function global_catch(Throwable $e)
{
	global $response;
	$response += ['error' => $e->getMessage() . ' received from line ' . $e->getLine()];

	echo json_encode($response);
}
set_exception_handler('global_catch');

// $response is an array containing an associative array that will be converted to JSON and sent back to the webpage
$response = array();

// Setting variables for connecting to SQL
$serverName = "localhost";
$serverPort = "postgresql";
$user = "grocer";
$pass = "grocer";
$databaseName = "temp_grocery";
$tableName = "groceries";

// Connect to postgresql groceries database as grocer
try {
	$dbh = new PDO("pgsql:host=$serverName;dbname=$databaseName;user=$user;password=$pass");

	// Makes the PDO throw exceptions rather than errors
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$response += ['database' => $databaseName];
} catch (PDOException $e) {
	// echo ',"status":"error","error":"' . $e->getMessage() . '"';
	$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
}

// Check if a table named groceries exists
try {
	// Returns all tables with the name 'groceries'
	$tableExists = $dbh->query("SELECT * FROM pg_catalog.pg_tables WHERE tablename = '$tableName';")->fetchAll(PDO::FETCH_COLUMN);

	if (count($tableExists) != 0) {
		$response += ['Table Exists' => true];
	} else { // If the pantry table doesn't exist, create it
		$response += ['Table Exists' => false];
		create_table();
	}

} catch (Exception $e) {
	$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
}

// Create a table named by $tableName
function create_table()
{
	global $dbh;
	global $response;
	global $tableName;
	try {
		$dbh->beginTransaction();
		// Create a table named "pantry" with the columns and types listed
		$dbh->exec("CREATE TABLE $tableName (
					name        text,
					code        text,
					number      smallint,
					given_name  text,
					allergens   jsonb
			);");

		$response += ['Created Pantry' => true];
		$dbh->commit();
	} catch (Throwable $e) {
		// Rollback any changes make between beginTransaction and here
		$dbh->rollback();
		$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
	}
}

// Depending on the goal in the header, do different things
$headers = apache_request_headers();
$goal = $headers["Goal"];
try {
	switch ($goal) {
		case 'get-table':
			get_table();
			break;

		case 'update':
			update_table();
			break;

		default:
			# code...
			break;
	}
} catch (Exception $e) {
	$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
}

// Returns the whole table
function get_table()
{
	global $response;
	global $dbh;
	global $tableName;

	try {

		$stmt = $dbh->prepare("SELECT * FROM $tableName");
		$stmt->execute();

		$gottenTable = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$response += ['table' => $gottenTable];

	} catch (Exception $e) {
		$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
	}
}

// Updates the database with the given table
function update_table()
{
	global $response;
	global $dbh;
	global $tableName;

	try {
		// Check to see if an item with the given barcode exists in the table
		$stmt = $dbh->prepare("SELECT * FROM $tableName WHERE $tableName.barcode = ?");
		$stmt->execute([$_POST["barcode"]]);

		$itemExists = $stmt->fetch(PDO::FETCH_ASSOC);

		$response += ['$itemExists' => $itemExists];

		// If the item doesn't exist add the item to the table
		if ($itemExists == false) {
			try {
				$dbh->beginTransaction();

				$stmt = $dbh->prepare("INSERT INTO $tableName (barcode, given_name, off_name, number, allergens, tags, favorite) VALUES (:barcode, :given_name, :off_name, :number, :allergens, :tags, :favorite) RETURNING *");
				// $stmt->execute(['barcode' => [$_POST['barcode']], 'given_name' => [$_POST['given_name']], 'off_name' => [$_POST['off_name']], 'number' => [$_POST['number']], 'allergens' => [$_POST['allergens']], 'tags' => [$_POST['tags']], 'favorite' => [$_POST['favorite']]]);
				$stmt->bindParam('barcode', $_POST['barcode']);
				$stmt->bindParam('given_name', $_POST['given_name']);
				$stmt->bindParam('off_name', $_POST['off_name']);
				$stmt->bindParam('number', $_POST['number']);
				$stmt->bindParam('allergens', $_POST['allergens']);
				$stmt->bindParam('tags', $_POST['tags']);
				$stmt->bindParam('favorite', $_POST['favorite']);				
				$stmt->execute();

				$response += ['Added' => $stmt->fetch(PDO::FETCH_ASSOC)];
				$dbh->commit();
			} catch (Exception $e) {
				$dbh->rollBack();
				$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
			}
			// If the item has deleted as true, remove the item
		} elseif ($_POST['deleted'] == 'true') {
			try {
				$dbh->beginTransaction();

				$response += ['DeleteState' => $_POST['deleted']];
				$stmt = $dbh->prepare("DELETE FROM $tableName WHERE $tableName.barcode = ?");
				$stmt->execute([$_POST['barcode']]);

				$response += ['Deleted' => $_POST['barcode']];
				$dbh->commit();
			} catch (Exception $e) {
				$dbh->rollBack();
				$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
			}
			// If the item exists and is not marked for deletion, update the table with whatever the new values
		} else {
			try {
				$dbh->beginTransaction();

				$stmt = $dbh->prepare("UPDATE $tableName SET given_name = :given_name, off_name = :off_name, number = :number, allergens = :allergens, tags = :tags, favorite = :favorite WHERE barcode = :barcode RETURNING *");
				$stmt->bindParam('barcode', $_POST['barcode']);
				$stmt->bindParam('given_name', $_POST['given_name']);
				$stmt->bindParam('off_name', $_POST['off_name']);
				$stmt->bindParam('number', $_POST['number']);
				$stmt->bindParam('allergens', $_POST['allergens']);
				$stmt->bindParam('tags', $_POST['tags']);
				$stmt->bindParam('favorite', $_POST['favorite']);				
				$stmt->execute();
				
				$response += ['Updated' => $stmt->fetch(PDO::FETCH_ASSOC)];
				$dbh->commit();
			} catch (Exception $e) {
				$dbh->rollBack();
				$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
			}
		}
	} catch (Exception $e) {
		$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
	}
}

echo json_encode($response);

// Convert the passed array to a JSON string, and an empty sting if the array is empty
function array_to_string($array): string
{
	global $response;
	$output_string = "";
	try {
		if (count(json_decode($array)) > 0)
		{
			$output_string = json_encode(json_decode($array));
		}
	} catch (Exception $e) {
		$response += ['error' => $e->getMessage() . ' at line ' . $e->getLine()];
	}
	return $output_string;
}