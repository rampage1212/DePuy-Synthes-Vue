<template>
  <div class="pt-4">
    <p class="text-gray-800">{{ stepInfoData.stepNumber }}</p>
    <p class="text-xl font-bold mb-5">{{ stepInfoData.stepName }}</p>
    <div v-for="list in pageNameLists" :key="list" class="flex flex-col">
      <SideNavList :list="list" />
      <div
        v-if="list.pageNumber < 7"
        class="border-l border-dashed border-gray-800 py-3 mx-2 my-1"
      ></div>
    </div>
  </div>
</template>
<script>
import SideNavList from './SideNavList.vue'
import { ref } from '@vue/reactivity'
export default {
  components: {
    SideNavList,
  },
  props: {
    pageName: { type: Array, required: true },
    stepInfo: { type: Object, required: true },
  },
  setup(props) {
    const pageNameLists = ref(props.pageName)
    const stepInfoData = ref(JSON.parse(JSON.stringify(props.stepInfo)))
    return {
      pageNameLists,
      stepInfoData,
    }
  },
}
</script>
