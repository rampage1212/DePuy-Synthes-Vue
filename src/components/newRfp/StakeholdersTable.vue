<template>
  <table class="w-full">
    <thead
      v-if="isOverview"
      class="bg-gray-75 text-left font-medium text-gray-500 uppercase tracking-wider w-full"
    >
      <tr class="bg-blue-555 text-white">
        <th class="rounded-tl-xl pl-2 pr-4">Name</th>
        <th class="pr-4">Role</th>
        <th class="pr-4">Info On The Individual</th>
        <th class="rounded-tr-xl">What They Want For Their Hospital</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(stakeHolder, index) in stakeHoldersRef"
        :key="index"
        class="space-x-8"
      >
        <td class="pl-2">
          <h1 class="text-title-jnj uppercase">
            {{ stakeHolder.title }}
          </h1>
        </td>
        <td>
          <input
            v-model.lazy="stakeHolder.name"
            placeholder="Name"
            :disabled="editIsDisallowed"
          />
        </td>

        <td>
          <input
            v-model.lazy="stakeHolder.individualInfo"
            type="text"
            placeholder="Info on the individual"
            :disabled="editIsDisallowed"
          />
        </td>
        <td>
          <input
            v-model.lazy="stakeHolder.need"
            type="text"
            class="w-full"
            placeholder="What They Want For Their Hospital"
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
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'
import { computed, ref, watch } from 'vue'

export default {
  props: {
    stakeHolders: { type: Array, required: true },
  },

  setup(props) {
    const store = useStore()
    const route = useRoute()

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )

    const isOverview = computed(() => route.params.step === '7')

    const editIsDisallowed = useRfpEditIsDisabled()
    const stakeHoldersRef = ref(JSON.parse(JSON.stringify(props.stakeHolders)))

    watch(
      stakeHoldersRef,
      () => {
        store.commit(
          'rfps/updateRfp',
          JSON.parse(
            JSON.stringify({
              ...presentation.value,
              stakeholders: stakeHoldersRef.value,
            }),
          ),
        )
      },
      { deep: true },
    )

    return {
      isOverview,
      editIsDisallowed,
      stakeHoldersRef,
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
/* td {
  @apply w-1/4;
} */
.radio-input {
  @apply w-5 h-5 border-2 border-gray-450;
}
</style>
