<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useControlsStore } from '../store/controls.store';
import Box from './elements/Box.vue';
import AppImage from './elements/AppImage.vue'
import { useMouseInElement, useDropZone } from '@vueuse/core';

const drawingAreaEl = ref<HTMLElement>()
const { elementX: relativeCursorX, elementY: relativeCursorY } = useMouseInElement(drawingAreaEl)

type ComponentKind = 'box' | 'image'

type Element = {
  kind: ComponentKind
  props: {
    startPositionX: number
    startPositionY: number
    [key: string]: any
  }
}

const componentKindMap = {
  'box': Box,
  'image': AppImage
}

const optionsKindMap: {
  [key in ComponentKind]: {
    color?: boolean,
    width?: boolean,
    height?: boolean
  }
} = {
  'box': {
    color: true,
    width: true,
    height: true
  },
  'image': {
    width: true,
    height: true
  }
}

const onDrop = (files: File[] | null) => {
  console.log('drop')

  if(!files || files.length === 0) {
    return
  }

  if(files.length > 1) {
    alert("You can only drop 1 image at a time")
  }

  const imageUrl = URL.createObjectURL(files[0])

  const image = new Image()

  image.onload = () => {
    const heightToWidth = image.height / image.width

    elements.push({
      kind: 'image',
      props: {
        startPositionX: relativeCursorX.value,
        startPositionY: relativeCursorY.value,
        width: 100,
        height: 100 * heightToWidth,
        src: imageUrl
      }
    })
  }

  image.onerror = () => {
    alert("Error loading image")
  }

  image.src = imageUrl
}

const controlsStore = useControlsStore()
const { isOverDropZone } = useDropZone(drawingAreaEl, onDrop)

const activeElementId = ref<number>(-1)
const elements = reactive<Element[]>([
  {
    kind: 'box',
    props: {
      startPositionX: 100,
      startPositionY: 100,
      width: 100,
      height: 100,
      color: '#ff0000'
    }
  },
])

const onDrawingAreaClick = () => {
  if(controlsStore.selectedInstrument === 'box') {
    elements.push({
      kind: 'box',
      props: {
        startPositionX: relativeCursorX.value,
        startPositionY: relativeCursorY.value,
        width: 100,
        height: 100
      }
    })

    controlsStore.selectedInstrument = 'cursor'
    activeElementId.value = elements.length - 1
  }
}

const onElementClick = (elementId: number) => {
  if(controlsStore.selectedInstrument === 'cursor') {
    activeElementId.value = elementId
  }
}

const onElementResize = (elementId: number, newWidth: number, newHeight: number) => {
  elements[elementId].props.width = newWidth
  elements[elementId].props.height = newHeight
}
</script>

<template>
  <div class="grid grid-cols-1 print:grid-rows-1 grid-rows-[80px_1fr] gap-3 px-8 py-8 bg-slate-200 print:!bg-white">
    <div class="print:hidden rounded-xl bg-white px-8 py-2">
      <div class="font-bold opacity-70" v-if="activeElementId === -1">No element selected</div>
      <div class="flex flex-row items-center gap-8 h-full" v-else>
        <label class="flex flex-row items-center gap-3">
          Position X:
          <input 
            v-model="elements[activeElementId].props.startPositionX" 
            class="border border-slate-300 rounded-md w-[90px] px-3 py-1" 
            type="number"
          >
        </label>
        <label class="flex flex-row items-center gap-3">
          Position Y:
          <input 
            v-model="elements[activeElementId].props.startPositionY" 
            class="border border-slate-300 rounded-md w-[90px] px-3 py-1" 
            type="number"
          >
        </label>
        <label v-if="optionsKindMap[elements[activeElementId].kind].width" class="flex flex-row items-center gap-3">
          Width:
          <input 
            v-model="elements[activeElementId].props.width" 
            class="border border-slate-300 rounded-md w-[90px] px-3 py-1" 
            type="number"
          >
        </label>
        <label v-if="optionsKindMap[elements[activeElementId].kind].height" class="flex flex-row items-center gap-3">
          Height:
          <input 
            v-model="elements[activeElementId].props.height" 
            class="border border-slate-300 rounded-md w-[90px] px-3 py-1" 
            type="number"
          >
        </label>
        <label v-if="optionsKindMap[elements[activeElementId].kind].color" class="flex flex-row items-center gap-3">
          Color:
          <input 
            v-model="elements[activeElementId].props.color" 
            class="border border-slate-300 rounded-md px-3 py-1" 
            type="text"
          >
        </label>
      </div>
    </div>
    <div ref="drawingAreaEl" @click="onDrawingAreaClick" class="relative h-full w-full bg-white rounded-xl overflow-hidden">
      <div v-if="isOverDropZone" class="bg-slate-200 opacity-70 absolute top-0 left-0 w-full h-full grid place-items-center font-bold text-3xl z-[110]">
        Release to add an image
      </div>

      <component 
        v-for="(element, id) of elements" 
        :is="componentKindMap[element.kind]" 
        v-bind="({
          isActiveElement: activeElementId === id,
          supportResize: true,
          key: id,
          ...element.props
        } as any)" 
        @mousedown="onElementClick(id)"
        @update:startPositionX="elements[id].props.startPositionX = $event"
        @update:startPositionY="elements[id].props.startPositionY = $event"
        @resize="onElementResize(id, $event[0], $event[1])"
      />

      <div class="print:hidden top-[15px] left-[25px] absolute font-bold text-slate-400 select-none z-[5]">You can drag and drop images here</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>