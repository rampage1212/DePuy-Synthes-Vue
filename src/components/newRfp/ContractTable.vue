<template>
  <div class="flex flex-col w-full">
    <div class="flex space-x-8 items-center">
      <h1 class="text-title-jnj uppercase min-w-64">Gpo Affiliation</h1>
      <input
        v-model.lazy="contractDetail.gpoAffilation"
        class="flex-grow mb-0.5"
        placeholder="Type Here"
        :disabled="editIsDisallowed"
      />
    </div>
    <div class="flex space-x-8 items-center">
      <h1 class="text-title-jnj uppercase min-w-64">Contract # And Name</h1>
      <input
        v-model.lazy="contractDetail.numberAndName"
        class="flex-grow mb-0.5"
        placeholder="Type Here"
        :disabled="editIsDisallowed"
      />
    </div>
    <div class="flex space-x-8 items-center">
      <h1 class="text-title-jnj uppercase min-w-64">Contract End Date</h1>
      <input
        v-model.lazy="contractDetail.endDate"
        class="flex-grow mb-0.5"
        placeholder="Type Here"
        :disabled="editIsDisallowed"
      />
    </div>
    <div class="flex space-x-8 items-center">
      <h1 class="text-title-jnj uppercase min-w-64">Notes</h1>
      <textarea
        v-model.lazy="contractDetail.notes"
        class="flex-grow mb-0.5"
        placeholder="Type Here"
        :disabled="editIsDisallowed"
      />
    </div>
  </div>
</template>
<script>
import { watch, ref } from 'vue'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'

export default {
  props: {
    contract: { type: Object, required: true },
  },
  emits: { updateContractdata: Object },
  setup(props, { emit }) {
    const contractDetail = ref(JSON.parse(JSON.stringify(props.contract)))
    const editIsDisallowed = useRfpEditIsDisabled()

    watch(
      contractDetail,
      (contractDetail) => emit('updateContractdata', contractDetail),
      {
        deep: true,
      },
    )

    return {
      contractDetail,
      editIsDisallowed,
    }
  },
}
</script>

<style scoped lang="postcss">
input,
textarea {
  @apply text-base font-normal leading-relaxed py-4 px-3 rounded-lg bg-gray-50 w-1/4;
}
input:disabled,
textarea:disabled {
  background-color: white;
}
.radio-input {
  @apply w-5 h-5 border-2 border-gray-450;
}
</style>
