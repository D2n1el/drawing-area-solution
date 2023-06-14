<script lang="ts" setup>
import { useControlsStore } from '../store/controls.store';
import { availableInstruments } from '../types/instrument.type'

const controlsStore = useControlsStore()
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[1fr_auto] py-8 px-6 bg-slate-600 print:hidden">
    <div class="flex flex-col items-stretch gap-3 ">
      <button 
        @click="controlsStore.setInstrument(instrument)" 
        v-for="instrument of availableInstruments" 
        :key="instrument" 
        class="capitalize text-white font-medium py-2 bg-transparent rounded-xl hover:bg-slate-700 transition-colors duration-200"
        :class="{'!bg-slate-500': instrument === controlsStore.selectedInstrument}"
      >
        {{ instrument }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>