<script setup>
const props = defineProps(['info']);
</script>

<template>
  <tr class="panel">
    <td colspan="3">
      <table>
        <thead class="panelHeader">
          <th>Barcode</th>
          <th>OFF Name</th>
          <th>Allergens</th>
          <th>Tags</th>
        </thead>
        <tr class="panelBody">
          <td class="barcode">{{ info.code }}</td>
          <td class="off_name">{{ info.off_name }}</td>
          <td class="allergens">{{ info.allergens }}</td>
          <td class="tags">{{ info.tags }}</td>
        </tr>
      </table>
    </td>
  </tr>

</template>

<style scoped>
table {
  width: 100%;
 }

.panel {
  background-color: var(--panel-color);
}

.panelHeader {
  background-color: var(--panel-header-color);
}
</style>