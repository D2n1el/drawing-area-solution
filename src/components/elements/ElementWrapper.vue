<script lang="ts" setup>
import { ref, watch, WatchStopHandle } from 'vue';
import { GenericDrawingElementProps } from './types'
import { useMouseInElement, useMousePressed, useParentElement, useKeyModifier } from '@vueuse/core'
import { useControlsStore } from '../../store/controls.store';

const props = defineProps<GenericDrawingElementProps>()
const emit = defineEmits(['update:startPositionX', 'update:startPositionY', 'resize'])

const wrapperElement = ref<HTMLElement>()
const parentElement = useParentElement()
const { elementX, elementY } = useMouseInElement(parentElement)
const { elementX: currentElementX, elementY: currentElementY } = useMouseInElement(wrapperElement)
const { pressed } = useMousePressed({
  target: wrapperElement
})
const isShiftPressed = useKeyModifier('Shift')

const controlsStore = useControlsStore()

let mousePositionStopHandle = undefined as WatchStopHandle | undefined

watch(pressed, (newState) => {
  if(controlsStore.selectedInstrument !== 'cursor') return

  if(newState) {
    mousePositionStopHandle = watch([elementX, elementY], ([newX, newY]) => {
      if(props.startPositionX !== newX) {
        emit('update:startPositionX', newX - currentElementX.value)
      }

      if(props.startPositionY !== newY) {
        emit('update:startPositionY', newY - currentElementY.value)
      }
    })
  } else if(mousePositionStopHandle) {
    mousePositionStopHandle()
  }
})

const onWrapperMouseUp = () => {
  if(mousePositionStopHandle) {
    mousePositionStopHandle()
  }
}

const onResizeAnchorMouseDown = (ev: Event) => {
  if(!props.supportResize)
    return

  ev.stopPropagation()

  if(mousePositionStopHandle) {
    mousePositionStopHandle()
  }

  mousePositionStopHandle = watch([currentElementX, currentElementY], ([newWidth, newHeight]) => {
    if(isShiftPressed.value) {
      const maxSize = newWidth >= newHeight ? newWidth : newHeight

      emit('resize', [maxSize, maxSize])
      return
    } 

    emit('resize', [newWidth, newHeight])
  })
}

const onResizeAnchorMouseUp = (ev: Event) => {
  ev.stopPropagation()

  if(mousePositionStopHandle) mousePositionStopHandle()
}
</script>

<template>
  <div @mouseup="onWrapperMouseUp" ref="wrapperElement" class="absolute hover:border-blue-300 border border-transparent z-[10] print:!border-none" :class="{'border-blue-300': props.isActiveElement}" :style="{
    top: `${props.startPositionY}px`,
    left: `${props.startPositionX}px`,
  }">
    <button 
      v-if="props.isActiveElement && controlsStore.selectedInstrument === 'cursor' && props.supportResize"
      class="absolute bottom-[-5px] right-[-5px] w-[10px] h-[10px] bg-blue-300 rounded-full print:hidden"
      @mousedown="onResizeAnchorMouseDown"
      @mouseup="onResizeAnchorMouseUp"
    />

    <slot/>
  </div>
</template>

<style scoped>
:deep() {
  user-select: none;
  -webkit-user-select: none;
}
</style>