<script setup>
    defineProps(['name', 'number', 'favorite'])
</script>

<template>
    <tr class="item">
        <td class="name">{{ name }}</td>
        <td>{{ number }}</td>
        <td>Stuff3</td>
    </tr>
</template>

<style scoped>
    .name {
        width: fit-content;
        min-width: 40%;
    }
</style>