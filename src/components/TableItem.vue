<script setup>
    defineProps(['code', 'name', 'number', 'favorite'])
</script>

<template>
    <tr v-bind:class="code">
        <td class="name">{{ name }}</td>
        <td>{{ number }}</td>
        <td class="favorite">Stuff3</td>
    </tr>
</template>

<style scoped>
    .name {
        width: fit-content;
        min-width: 40%;
    }
</style>