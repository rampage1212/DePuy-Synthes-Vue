<template>
  <div class="flex py-7 px-8 flex-col items-start">
    <h1 v-if="!isOverview" class="text-header-jnj text-primary pb-6">
      Map Stakeholders at the Customer
    </h1>

    <stakeholders-table :stake-holders="stakeHoldersData" />
  </div>
</template>

<script>
import StakeholdersTable from './StakeholdersTable.vue'
import { useRoute } from 'vue-router'
import { computed } from '@vue/runtime-core'
export default {
  components: {
    StakeholdersTable,
  },

  props: {
    stakeHolders: { type: Object, required: true },
  },
  setup(props) {
    const route = useRoute()
    const allStakeHoldersData = JSON.parse(JSON.stringify(props.stakeHolders))
    const realStakeHoldersData = allStakeHoldersData.filter((item) => item.name)
    const isOverview = computed(() => route.params.step === '7')
    const stakeHoldersData = isOverview.value
      ? realStakeHoldersData
      : allStakeHoldersData
    return {
      stakeHoldersData,
      isOverview,
    }
  },
}
</script>
