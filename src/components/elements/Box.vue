<script lang="ts" setup>
import ElementWrapper from './ElementWrapper.vue'
import { GenericDrawingElementProps } from './types';

const props = withDefaults(defineProps<GenericDrawingElementProps & {
  width: number,
  height: number,
  color?: string
}>(), {
  color: '#000000'
})

const emit = defineEmits(['update:startPositionX', 'update:startPositionY', 'resize'])
</script>

<template>
  <ElementWrapper 
    @update:start-position-x="emit('update:startPositionX', $event)"
    @update:start-position-y="emit('update:startPositionY', $event)"
    @resize="emit('resize', $event)"
    v-bind="props"
  >
    <div :style="{
      width: `${props.width}px`,
      height: `${props.height}px`,
      background: props.color
    }"/>
  </ElementWrapper>
</template>

<style lang="scss" scoped>

</style>