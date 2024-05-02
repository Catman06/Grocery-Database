<script setup>
import TableItem from '../components/TableItem.vue'
</script>

<template>
    <table class="table">
      <thead>
        <tr>
          <th>Header1</th>
          <th>Header2</th>
          <th>Header3</th>
        </tr> 
      </thead>

      <TableItem />
      <TableItem />
      <TableItem />
      <TableItem />
      <TableItem />
    </table>
  </template>
  
  <style>
  /* Table */
  .table {
    --table-border-style: solid;
    --table-border-width: 3px;
    --table-border-color: var(--accent-green);

    text-align: center;
    width: 100%;
    margin-top: 2rem;
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
  @media (hover: hover) {
  .item:hover {
    background-color: var(--item-hover);
  }
  .item:active {
    background-color: var(--item-active);
  }
}

  /* Horizontal Display */
  @media (min-width: 1024px) {

  }
  </style>