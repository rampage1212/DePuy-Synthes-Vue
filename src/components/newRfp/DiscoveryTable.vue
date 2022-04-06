<template>
  <table class="w-full">
    <thead
      v-if="isOverview"
      class="bg-gray-75 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-full"
    >
      <tr class="bg-blue-555 text-white">
        <th class="rounded-tl-xl pl-2 pr-4">Name</th>
        <th class="pr-4">Annual $ (M)</th>
        <th class="pr-4">MS%</th>
        <th class="rounded-tr-xl">Competition Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(discovery, index) in refDiscovery"
        :key="index"
        class="space-x-8"
      >
        <td class="pl-2">
          <h1 class="text-title-jnj uppercase">
            {{ discovery.title }}
          </h1>
        </td>
        <td>
          <input
            v-model.lazy="discovery.annual"
            placeholder="Annual $(M)"
            :disabled="editIsDisallowed"
          />
        </td>

        <td>
          <input
            v-model.lazy="discovery.ms"
            type="text"
            placeholder="MS%"
            :disabled="editIsDisallowed"
          />
        </td>
        <td>
          <input
            v-model.lazy="discovery.need"
            type="text"
            placeholder="Competition Notes"
            :disabled="editIsDisallowed"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'

export default {
  props: {
    discoveries: { type: Array, required: true },
  },

  setup(props) {
    const store = useStore()
    const route = useRoute()

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )
    const isOverview = computed(() => route.params.step === '7')

    const editIsDisallowed = useRfpEditIsDisabled()

    const refDiscovery = ref(JSON.parse(JSON.stringify(props.discoveries)))

    const updateDiscovery = () => {
      store.commit(
        'rfps/updateRfp',
        JSON.parse(
          JSON.stringify({
            ...presentation.value,
            discovery: refDiscovery.value,
          }),
        ),
      )
    }

    watch(refDiscovery, updateDiscovery, { deep: true })

    return {
      refDiscovery,
      isOverview,
      editIsDisallowed,
    }
  },
}
</script>

<style scoped lang="postcss">
input {
  @apply text-base font-normal leading-relaxed py-4 px-3 rounded-lg bg-gray-50 w-full;
}
input:disabled {
  background-color: white;
}
th {
  @apply py-3 text-base font-normal font-Arial;
}
td {
  @apply w-1/4;
}
.radio-input {
  @apply w-5 h-5 border-2 border-gray-450;
}
</style>
