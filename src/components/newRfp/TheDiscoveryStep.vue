<template>
  <div class="flex py-7 px-8 flex-col items-start">
    <h1 v-if="!isOverview" class="text-header-jnj text-primary pb-6">
      Collect Reconnaissance and Discover Customer Problem to Be Solved
    </h1>
    <h1 v-else class="py-2">BU</h1>
    <discovery-table :discoveries="discoveriesData" />
  </div>
</template>

<script>
import DiscoveryTable from './DiscoveryTable.vue'
import { computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

export default {
  components: {
    DiscoveryTable,
  },

  props: {
    discoveries: { type: Object, required: true },
  },

  setup(props) {
    const route = useRoute()
    const allDiscoveriesData = JSON.parse(JSON.stringify(props.discoveries))
    const isOverview = computed(() => route.params.step === '7')
    const realDiscoveriesData = allDiscoveriesData.filter((item) => item.annual)
    const discoveriesData = isOverview.value
      ? realDiscoveriesData
      : allDiscoveriesData

    return {
      discoveriesData,
      isOverview,
    }
  },
}
</script>
