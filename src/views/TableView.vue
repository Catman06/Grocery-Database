<script setup>
import TableItem from '../components/TableItem.vue'
</script>

<template>
    <div class="table">
      <h1>This will be where the table is to be put</h1>
      <TableItem />
    </div>
  </template>
  
  <style>
  .table {
    text-align: center;
  }
  @media (min-width: 1024px) {
    .table {
      min-height: 100vh;
      display: flex;
    }
  }
  </style>