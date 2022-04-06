<template>
  <div class="flex flex-col py-4 w-full space-y-4">
    <div class="flex space-x-6 items-center">
      <img :src="categoryInfo.imgSrcRed" class="h-10 w-10 object-contain" />
      <h1>{{ categoryInfo.groupTitle }}</h1>
    </div>
    <div class="flex flex-wrap">
      <slide-item
        v-for="slide in categorySlides"
        :key="slide.slideInfoId"
        :slide="slide"
        class="w-1/5 mr-8 mt-8"
        @toggle-selection="slide.isEnabled = !slide.isEnabled"
      />
    </div>
  </div>
</template>

<script>
import SlideItem from './SlideItem.vue'
import slideCategoryInfo from '@/data/SlideCategoryInfo.js'
import { computed } from 'vue'

export default {
  components: { SlideItem },
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
