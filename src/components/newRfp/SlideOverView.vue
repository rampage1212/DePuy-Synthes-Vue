<template>
  <div>
    <h1>Customer Information</h1>
    <customer-info-step ref="customerInfoComponent" />

    <h1>The Team</h1>
    <the-team-step />

    <h1>The Customer</h1>
    <the-customer-step
      :stake-holders="presentation.stakeholders || defaultStakeHolders"
    />

    <h1>The Discovery</h1>
    <the-discovery-step
      :discoveries="presentation.discovery || defaultDiscoveries"
    />

    <h1>The Contract</h1>
    <the-contract-step
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

    <h1>The Presentation</h1>
    <PresentationConfigureStep
      :slide-selection="
        presentation.slideSelection || defaultPresentationConfig
      "
    />
  </div>
</template>

<script>
import CustomerInfoStep from '@/components/newRfp/CustomerInfoStep.vue'
import TheTeamStep from '@/components/newRfp/TheTeamStep.vue'
import TheCustomerStep from '@/components/newRfp/TheCustomerStep.vue'
import TheDiscoveryStep from '@/components/newRfp/TheDiscoveryStep.vue'
import PresentationConfigureStep from '@/components/newRfp/PresentationConfigureStep.vue'
import TheContractStep from '@/components/newRfp/TheContractStep.vue'
import defaultStakeHolders from '@/data/defaultStakeHolders.json'
import defaultDiscoveries from '@/data/defaultDiscoveries.json'
import defaultPresentationConfig from '@/data/defaultPresentationConfig.json'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  components: {
    CustomerInfoStep,
    TheTeamStep,
    TheCustomerStep,
    TheDiscoveryStep,
    PresentationConfigureStep,
    TheContractStep,
  },
  setup() {
    const route = useRoute()
    const store = useStore()

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )

    const customerInfoComponent = ref(null)
    const uploadCustomerLogo = (presentationIdParam) =>
      customerInfoComponent.value?.uploadImage(presentationIdParam)

    return {
      presentation,
      defaultStakeHolders,
      defaultDiscoveries,
      defaultPresentationConfig,
      customerInfoComponent,
      uploadCustomerLogo,
    }
  },
}
</script>

<style scoped lang="postcss">
h1 {
  @apply text-gray-475 px-8 py-4 text-2xl font-bold;
  background-color: #f4f4f4;
}
</style>
