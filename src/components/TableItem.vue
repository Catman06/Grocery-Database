<script setup>
    import TablePanel from '../components/TablePanel.vue';
    import { ref } from "vue";
    const props = defineProps(['code', 'name', 'number', 'favorite']);

    let favTxt = "";
    if (props.favorite == true) {
        favTxt = "*";
    }

    const panel = ref(false);

    const panelEvent = new Event('toggle-panel', {bubbles: true});

    // Toggles the panel, emitting an event to close all others
    function togglePanel(event) {
        event.target.dispatchEvent(panelEvent);
        panel.value = !panel.value;
    }

    function closePanel(event) {
        panel.value = false;
    }
</script>

<template>
    <tr v-bind:class="code"  class="item" @click="togglePanel" @close-panel="closePanel">
        <td class="name">{{ name }}</td>
        <td>{{ number }}</td>
        <td class="favorite">{{ favTxt }}</td>
    </tr>
    <!-- Only Shows if 'panel' is true -->
    <TablePanel v-if="panel"/>
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