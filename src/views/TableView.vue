<script setup>
import TableItem from '../components/TableItem.vue'
import { ref } from "vue";

let example_items = [
  {code: "1", name: 'A name1' , number: 1 },
  {code: "2", name: 'A name that is quite a long one, too long in fact2' , number: 2 },
  {code: "3", name: 'A name3' , number: 3 },
  {code: "4", name: 'A name4' , number: 4 },
  {code: "5", name: 'A name5' , number: 5 }
]

</script>

<template>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Favorite</th>
        </tr> 
      </thead>
      <tbody>
        <TableItem class="item"
          v-for="info in example_items"
          :code="info.code"
          :name="info.name"
          :number="info.number"
        />
      </tbody>

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