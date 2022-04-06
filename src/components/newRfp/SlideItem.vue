<template>
  <div class="flex flex-col space-y-3 rounded-md min-w-28">
    <div class="flex w-full relative min-h-14 slide-img-aspect-ratio">
      <img class="w-80 border rounded-md" :src="slideDetail.fullImgSrc" />
      <div
        v-if="!isEnabled"
        class="flex items-center justify-center bg-gray-500 absolute top-0 h-full w-full bg-opacity-50 rounded-md"
      >
        <SvgIcon name="eyeOff" class="h-11 w-11" />
      </div>
    </div>

    <div class="flex justify-between w-full">
      <div class="flex flex-col items-start">
        <h6>{{ slideDetail.slideTitle }}</h6>
        <h1>{{ slideDetail.subTitle }}</h1>
      </div>
      <button v-if="!editIsDisallowed" @click="toggle">
        <SvgIcon name="view" class="h-5 w-5 text-gray-425" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from '@vue/runtime-core'
import { slideDetails } from '@/data/allSlides.js'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'

export default {
  props: {
    slide: {
      type: Object,
      required: true,
    },
  },

  emits: ['toggleSelection'],

  setup(props, { emit }) {
    const isEnabled = ref(props.slide.isEnabled)

    const toggle = () => {
      isEnabled.value = !isEnabled.value
      emit('toggleSelection')
    }

    const slideDetail = computed(
      () => slideDetails(props.slide.slide || props.slide) || {},
    )
    const editIsDisallowed = useRfpEditIsDisabled()

    watch(
      () => props.slide,
      (newValue) => {
        isEnabled.value = newValue.isEnabled
      },
    )

    return { isEnabled, toggle, slideDetail, editIsDisallowed }
  },
}
</script>
<style scoped>
.slide-img-aspect-ratio {
  aspect-ratio: 1200/720;
}
</style>
