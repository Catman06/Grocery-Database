<script setup>
    const props = defineProps(['code', 'name', 'number', 'favorite']);

    let favTxt = "";
    if (props.favorite == true) {
        favTxt = "*";
    }
</script>

<template>
    <tr v-bind:class="code">
        <td class="name">{{ name }}</td>
        <td>{{ number }}</td>
        <td class="favorite">{{ favTxt }}</td>
    </tr>
</template>

<style scoped>
    .name {
        width: fit-content;
        min-width: 40%;
    }

    .favorite {
        width: 10%;
    }
</style>