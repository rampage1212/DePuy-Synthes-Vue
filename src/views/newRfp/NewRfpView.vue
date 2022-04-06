<template>
  <page-wrapper title="">
    <builder-header />
    <rfp-step-wrapper
      v-if="presentation"
      :upload-customer-logo="uploadCustomerLogo"
    >
      <customer-info-step v-if="currentStep == 1" ref="customerInfoComponent" />
      <the-team-step v-if="currentStep === 2" />
      <the-customer-step
        v-else-if="currentStep === 3"
        :stake-holders="presentation.stakeholders || defaultStakeHolders"
      />
      <the-discovery-step
        v-if="currentStep === 4"
        :discoveries="presentation.discovery || defaultDiscoveries"
      />
      <the-contract-step
        v-if="currentStep === 5"
        :contract="
          presentation.contract || {
            gpoAffilation: '',
            numberAndName: '',
            endDate: '',
            notes: '',
            priceAvailable: null,
          }
        "
      />
      <PresentationConfigureStep
        v-if="currentStep === 6"
        :slide-selection="
          presentation.slideSelection || defaultPresentationConfig
        "
      />
      <SlideOverView v-if="currentStep === OVERVIEW_STEP" />
      <slide-selection-step v-if="currentStep == SLIDE_SELECTION_STEP" />
    </rfp-step-wrapper>

    <ApiState
      v-else
      :loading="loading"
      :error-message="error"
      data-type="presentation"
      class="mt-2"
    />
  </page-wrapper>
</template>

<script>
import PageWrapper from '@/components/utils/container/PageWrapper.vue'
import builderHeader from '@/components/builder/wizardHeader.vue'
import RfpStepWrapper from '@/components/newRfp/RfpStepWrapper.vue'
import CustomerInfoStep from '@/components/newRfp/CustomerInfoStep.vue'
import SlideSelectionStep from '@/components/newRfp/SlideSelectionStep.vue'
import SlideOverView from '@/components/newRfp/SlideOverView.vue'
import TheTeamStep from '@/components/newRfp/TheTeamStep.vue'
import TheCustomerStep from '@/components/newRfp/TheCustomerStep.vue'
import TheDiscoveryStep from '@/components/newRfp/TheDiscoveryStep.vue'
import TheContractStep from '@/components/newRfp/TheContractStep.vue'
import PresentationConfigureStep from '@/components/newRfp/PresentationConfigureStep.vue'
import ApiState from '@/components/utils/apiState.vue'
import { onMounted, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import defaultStakeHolders from '@/data/defaultStakeHolders.json'
import defaultDiscoveries from '@/data/defaultDiscoveries.json'
import defaultPresentationConfig from '@/data/defaultPresentationConfig.json'

export default {
  components: {
    PageWrapper,
    builderHeader,
    RfpStepWrapper,
    CustomerInfoStep,
    SlideSelectionStep,
    TheTeamStep,
    TheCustomerStep,
    TheDiscoveryStep,
    TheContractStep,
    PresentationConfigureStep,
    ApiState,
    SlideOverView,
  },

  setup() {
    const route = useRoute()
    const currentStep = computed(() => Number(route.params.step) || 1)
    const presentationId = computed(() => route.params.presentationId)
    const store = useStore()

    const OVERVIEW_STEP = 7
    const SLIDE_SELECTION_STEP = 8

    const loading = ref(false)
    const error = ref('')

    async function fetchRfp() {
      if (presentationId.value) {
        loading.value = true
        const { err } = await store.dispatch(
          'rfps/getMyRfpbyId',
          presentationId.value,
        )
        if (err) error.value = err.message || err
        loading.value = false
      }
    }

    onMounted(fetchRfp)

    watch(presentationId, fetchRfp)

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](presentationId.value),
    )

    const customerInfoComponent = ref(null)
    const uploadCustomerLogo = (presentationIdParam) =>
      customerInfoComponent.value?.uploadImage(presentationIdParam)

    return {
      currentStep,
      presentation,
      defaultStakeHolders,
      defaultDiscoveries,
      loading,
      error,
      customerInfoComponent,
      uploadCustomerLogo,
      OVERVIEW_STEP,
      SLIDE_SELECTION_STEP,
      defaultPresentationConfig,
    }
  },
}
</script>
