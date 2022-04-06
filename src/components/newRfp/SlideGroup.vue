<template>
  <div class="flex flex-col py-4 w-full space-y-4">
    <div class="flex space-x-6 items-center">
      <img :src="categoryInfo.imgSrcRed" class="h-10 w-10 object-contain" />
      <h1 data-test="groupTitle">{{ categoryInfo.groupTitle }}</h1>
    </div>
    <div class="flex w-full flex-wrap space-y-2">
      <slide-selection-item
        v-for="slide in categorySlides"
        :key="slide.slideNumber"
        :slide="slide"
        :data-test="`selection-item-${slide.slideNumber}`"
        class="w-1/3 md:w-1/4 xl:w-1/5 h-28 mt-auto"
      />
    </div>
  </div>
</template>

<script>
import SlideSelectionItem from './SlideSelectionItem.vue'
import slideCategoryInfo from '@/data/SlideCategoryInfo.js'
import { computed } from 'vue'

export default {
  components: { SlideSelectionItem },
  props: {
    category: { type: String, required: true },
    categorySlides: { type: Array, required: true },
  },

  setup(props) {
    const categoryInfo = computed(() => slideCategoryInfo[props.category])
    return {
      categoryInfo,
    }
  },
}
</script>
