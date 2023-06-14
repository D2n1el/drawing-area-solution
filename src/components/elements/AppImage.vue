<script lang="ts" setup>
import ElementWrapper from './ElementWrapper.vue'
import { GenericDrawingElementProps } from './types';

const props = defineProps<GenericDrawingElementProps & {
  width: number,
  height: number,
  src: string
}>()

const emit = defineEmits(['update:startPositionX', 'update:startPositionY', 'resize'])

</script>

<template>
  <ElementWrapper 
    @update:start-position-x="emit('update:startPositionX', $event)"
    @update:start-position-y="emit('update:startPositionY', $event)"
    @resize="emit('resize', $event)"
    v-bind="props"
  >
    <img :src="props.src" :style="{
      width: `${props.width}px`,
      height: `${props.height}px`
    }" draggable="false"/>
  </ElementWrapper>
</template>

<style lang="scss" scoped>

</style>