<template>
  <div v-if="presentationIsLoaded" class="pdf-slide-container">
    <allPresentations :allow-animations="false" :is-pdf-view="true" />
  </div>
  <div v-else class="flex w-full h-full">
    <ApiState
      :loading="loading"
      :error-message="errorMessage"
      data-type="presentation"
      class="m-auto"
    />
  </div>
</template>

<script>
import allPresentations from '@/components/slides/allPresentations.vue'
import ApiState from '@/components/utils/apiState.vue'
import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: {
    allPresentations,
    ApiState,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const errorMessage = ref('')
    const loading = ref(false)

    onMounted(async () => {
      errorMessage.value = ''
      loading.value = true

      const isPrintPdf = route.name == 'print-pdf'

      const { err } = route.params.hyperLink
        ? await store.dispatch(
            isPrintPdf
              ? 'rfps/getLinkByHyperLinkAndToken'
              : 'rfps/getLinkByHyperLink',
            {
              hyperLink: route.params.hyperLink,
              clientName: route.params.clientName,
              token: route.query.token,
            },
          )
        : await store.dispatch('rfps/getMyRfpbyId', route.params.presentationId)

      errorMessage.value = err
        ? `Loading Failed: ${
            err.message ||
            err.response?.statusText ||
            err.statusText ||
            err.status ||
            err
          }`
        : ''

      loading.value = false

      const printPDF = () => {
        setTimeout(function () {
          window.print()
        }, 5000)
      }
      if (!isPrintPdf) printPDF()
    })

    const presentationIsLoaded = computed(() =>
      route.params.hyperLink
        ? Boolean(
            store.getters['rfps/getLinkByHyperLink'](
              route.params.clientName,
              route.params.hyperLink,
            ),
          )
        : Boolean(
            store.getters['rfps/getPresentationById'](
              route.params.presentationId,
            ),
          ),
    )
    return { presentationIsLoaded, errorMessage, loading }
  },
}
</script>

<style lang="postcss">
.pdf-slide-container > * {
  width: 1280px;
  height: 720px;
  min-height: 720px;
  /* aspect-ratio: 1280/720; */
  page-break-after: always;
}
@page {
  size: 1280px 720px;
}
</style>
