<template>
  <section>
    <h1 class="text-header-jnj py-3">Recent Drafts</h1>
    <base-card class="flex bg-white border-none flex-wrap justify-center">
      <ApiState
        v-if="draftRfps.length === 0"
        :loading="isLoading"
        data-type="draftRfps"
      />
      <draft-item
        v-for="rfp in draftRfps"
        :key="rfp.presentationId"
        :draft-item="rfp"
        class="mx-2 mb-4 md:w-4/9 w-full"
      />
    </base-card>
  </section>
</template>
<script>
import BaseCard from '@/components/utils/container/BaseCard.vue'
import ApiState from '@/components/utils/apiState.vue'
import DraftItem from './DraftItem.vue'
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'

export default {
  components: {
    BaseCard,
    DraftItem,
    ApiState,
  },
  setup() {
    const store = useStore()
    const draftRfps = computed(() =>
      store.getters['rfps/getDraftRfps'].slice(0, 4),
    )

    const isLoading = ref(false)
    const loadingError = ref('')

    onMounted(async () => {
      isLoading.value = true
      const { err } = await store.dispatch('rfps/fetchMyRfps', {
        limit: 4,
        page: 0,
        notPublished: true,
      })
      if (err) loadingError.value = err.message || err
      isLoading.value = false
    })

    return {
      draftRfps,
      isLoading,
      loadingError,
    }
  },
}
</script>
