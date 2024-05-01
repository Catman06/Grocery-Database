<script setup>
import TableItem from '../components/TableItem.vue'
</script>

<template>
    <div class="table">
      <h1>This will be a table eventually</h1>
      <TableItem />
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .table {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>