import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Instrument } from '../types/instrument.type'

export const useControlsStore = defineStore('controls', () => {
  const selectedInstrument = ref<Instrument>('cursor')

  const setInstrument = (newInstrument: Instrument) => {
    selectedInstrument.value = newInstrument
  }

  return {
    selectedInstrument,
    setInstrument
  }
})