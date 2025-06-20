# Grocery Database
<h4>This is the site that interacts with a postgresql database that holds information on owned groceries.</h4>
Will not function with out changes to stuff like urls for php and the database being used
<p>
  It will primarily consist of 2 parts: the scanner & the table.<br>
The scanner will provide an interface for using a device camera to scan an item's barcode, retrieve info from the <a href="https://github.com/openfoodfacts/openfoodfacts-server">Open Food Fact database</a>, and store the relevent info into our database.<br>
The table is the primary part of the site and will allow for the viewing, searching, altering, and removing of items in the database.
</p>
<p>
  The database will be <a href="https://www.postgresql.org/">PostgreSQL</a> and hold the following data and it's data type on each item:
  <ul>
    <li>Barcode as text</li>
    <li>Name from OFF as text</li>
    <li>User-given Name as text</li>
    <li>Number of items as integer</li>
    <li>List of Allergens as json</li>
    <li>List of Tags as json</li>
    <li>Favorite as boolean</li>
  </ul>
</p>

