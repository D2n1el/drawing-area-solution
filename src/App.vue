<script setup lang="ts">
import AppControls from './components/AppControls.vue';
import DrawingArea from './components/DrawingArea.vue';

</script>

<template>
  <div class="w-full h-screen grid print:grid-cols-1 grid-cols-[200px_1fr] grid-rows-1">
    <AppControls/>
    <DrawingArea/>
  </div>
</template>

<style scoped>
</style>
