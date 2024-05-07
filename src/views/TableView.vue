<script setup>
import TableItem from '../components/TableItem.vue'
import database from '../assets/pretend_database.json'

let example_items = database.items

// Takes the toggle-panel event and sends a close-panel event to all children but the one the inital event came from
const closePanel = new Event('close-panel');
function closeEventRedirect(event) {
  Array.from(document.getElementsByClassName('item')).forEach(item => {
    if (event.target.parentElement != item) {
      item.dispatchEvent(closePanel);
    }
  });

  // Opens the popup for editing an item
  document.getElementById('mainTable').addEventListener('edit-clicked', openEditPopup, { capture: true });
  function openEditPopup(event) {
    console.log(event);
  }
}
</script>

<template>
  <div>
    <table id="mainTable" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Favorite</th>
        </tr>
      </thead>
      <tbody @toggle-panel="closeEventRedirect">
        <TableItem v-for="info in example_items" :info="info" />
      </tbody>
    </table>
  </div>

</template>

<style>
/* Table */
.table {
  --table-border-style: solid;
  --table-border-width: 3px;
  --table-border-color: var(--accent-green);

  text-align: center;
  width: 100%;
  max-width: 1028px;
  margin: 2rem auto;
  border-radius: 10px;
  border-spacing: 0;
  border: var(--table-border-width) var(--table-border-style) var(--table-border-color);
}

thead {
  background-color: var(--accent-green);
}

/* TableItems are classed 'item' */
.item {
  background-color: var(--accent-grey);
}

.item:nth-of-type(even) {
  background-color: var(--accent-light-grey);
}

.item>* {
  padding: 5px;
}

@media (hover: hover) {
  .item:hover {
    background-color: var(--item-hover);
  }

  .item:active {
    background-color: var(--item-active);
  }
}

/* Horizontal Display */
@media (min-width: 1024px) {}
</style>