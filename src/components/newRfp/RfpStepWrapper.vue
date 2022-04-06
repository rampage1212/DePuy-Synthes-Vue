<template>
  <base-card class="rounded-2xl h-full" card-style="bg-white pt-7">
    <form class="flex flex-col w-full" @submit.prevent="next()">
      <h1 class="px-2 mx-6 font-JnJ font-medium text-2xl text-gray-850">
        {{ title }}
      </h1>
      <error-banner
        v-if="versionError"
        class="flex my-1 mx-6"
        :message="versionError"
      />
      <div class="w-full pb-7 min-h-screen">
        <slot />
      </div>
      <footer
        class="flex justify-between px-9 py-3 items-center sticky bottom-0 bg-white"
        style="box-shadow: 0px -1px 8px #ececf2"
      >
        <dp-button
          type="button"
          text="Previous"
          :disabled="!(step > 1)"
          class="py-4 px-14 text-white bg-secondary h-btn-builder min-h-btn-builder my-auto"
          @click="previous"
        />
        <h1>
          <span class="text-2xl font-black tracking-widest text-indigo-800"
            >{{ step }}/</span
          >
          <span class="text-lg font-bold text-gray-500">{{ TOTAL_STEPS }}</span>
        </h1>
        <div class="flex">
          <dp-button
            v-if="step === OVERVIEW_STEP || step === SLIDE_SELECTION_STEP"
            type="button"
            text="Export"
            class="bordered-dp-button px-12 mr-2 border rounded-xl border-red-700 font-bold text-center text-red-700"
          />

          <dp-button
            v-else-if="
              step !== SLIDE_SELECTION_STEP || (!isNewRfp && step == 1)
            "
            type="button"
            text="Skip To Slides"
            class="bordered-dp-button px-3 mr-2 border rounded-xl border-red-700 font-bold text-center text-red-700"
            @click="skipToSlides(), skipSlideGaLog()"
          />
          <dp-button
            :loading="isUpdating"
            type="submit"
            text="Next"
            class="py-4 w-40 text-white bg-secondary h-btn-builder min-h-btn-builder my-auto rounded-xl"
            :class="isUpdating ? 'pr-12' : ''"
          />
        </div>
      </footer>
    </form>
  </base-card>
</template>

<script>
import BaseCard from '@/components/utils/container/BaseCard.vue'
import DpButton from '@/components/buttons/DpButton.vue'
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ErrorBanner from '../utils/ErrorBanner.vue'
import versionedApiUpdate from '@/utils/versionedApiUpdate.js'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'
import { isEqual } from 'lodash'
import { gaEvent } from '@/utils/GA_Event.js'

const PRESENTATION_CONFIGURE_STEP = 6
const OVERVIEW_STEP = 7
const SLIDE_SELECTION_STEP = 8
const TOTAL_STEPS = 8

const titles = {
  1: 'Customer Information',
  2: 'The Team',
  3: 'The Customer',
  4: 'The Discovery',
  5: 'The Contract',
  [PRESENTATION_CONFIGURE_STEP]: 'The Presentation',
  [OVERVIEW_STEP]: 'Overview',
  [SLIDE_SELECTION_STEP]: 'Slide Selection',
}
export default {
  components: {
    BaseCard,
    DpButton,
    ErrorBanner,
  },
  props: {
    uploadCustomerLogo: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const currentStep = computed(() => Number(route.params.step) || 1)
    const title = computed(() => titles[currentStep.value])
    const isNewRfp = computed(() => route.params.presentationId == null)
    const currentRfp = computed(() => store.getters['rfps/getCurrentRfp'])
    const emptyCurrentRfp = computed(
      () => store.getters['rfps/getEmptyCurrentRfp'],
    )
    const createdpresentationId = ref('')
    const presentationId = computed(
      () => route.params.presentationId || createdpresentationId.value,
    )

    const nextPath = computed(() => {
      if (!presentationId.value) return

      if (currentStep.value < TOTAL_STEPS) {
        return {
          name: 'update-presentation',
          params: {
            presentationId: presentationId.value,
            step: currentStep.value + 1,
          },
        }
      }

      return {
        name: 'builder',
        params: {
          presentationId: presentationId.value,
          slideId: 'INTRO1',
        },
      }
    })

    const createRfp = async () => {
      // create presentation
      if (!currentRfp.value.customerName) {
        throw 'Please Enter Customer Name'
      }

      const newRfp = {
        customerName: currentRfp.value.customerName,
        contact: JSON.stringify(currentRfp.value.contact),
        stakeHolder: JSON.stringify(currentRfp.value.stakeholders || ''),
        customerProblem: currentRfp.value.customerProblem,
      }
      let createdRfp = await store.dispatch('rfps/createRfp', newRfp)
      createdpresentationId.value = createdRfp.presentationId

      const templateId = route.params.templateId

      if (templateId) {
        const templateState =
          store.getters['templates/getTemplateByID'](templateId)
        const templateSlides = templateState.slides
        const presentationSlides = createdRfp.slides

        const correspondingTemplateSlide = (rfpSlide) =>
          templateSlides?.find(
            (templateSlide) =>
              templateSlide.slide.prePopulatedSlide ===
              rfpSlide.slide.prePopulatedSlide,
          )

        const updatedSlides = presentationSlides.map((presentationSlide) => ({
          ...presentationSlide,
          isEnabled: Boolean(
            correspondingTemplateSlide(presentationSlide)?.isEnabled,
          ),
        }))

        store.commit('rfps/updateRfp', {
          ...createdRfp,
          slides: updatedSlides,
        })

        createdRfp = await store.dispatch('rfps/saveRfpChanges', {
          presentationId: createdRfp.presentationId,
          updateType: 'slides',
        })
      }
      await props.uploadCustomerLogo(createdRfp.presentationId)

      return createdRfp
    }

    const rfpUpdateTypesPerStep = {
      1: 'contact',
      2: 'internalUserDetails',
      3: 'stakeholders',
      4: 'discovery',
      5: 'contract',
      [PRESENTATION_CONFIGURE_STEP]: 'slideSelection',
      [SLIDE_SELECTION_STEP]: 'slides',
    }

    async function saveChanges() {
      if (currentStep.value === 1 && isNewRfp.value) {
        await createRfp()
        return
      }

      if (currentStep.value === 1) {
        await props.uploadCustomerLogo()
      }

      const updatedRfp = await store.dispatch('rfps/saveRfpChanges', {
        presentationId: presentationId.value,
        updateType: rfpUpdateTypesPerStep[currentStep.value],
      })

      return updatedRfp
    }

    const next = async () => {
      await updateApi()
      if (
        nextPath.value &&
        (route.name === 'update-presentation' ||
          route.name === 'new-presentation')
      ) {
        router.push(nextPath.value)
      }
    }
    const previous = () => {
      if (currentStep.value > 1) {
        router.push({
          name: 'update-presentation',
          params: {
            presentationId: presentationId.value,
            step: currentStep.value - 1,
          },
        })
      }
    }

    const skipToSlides = async () => {
      if (currentStep.value === 1 && isNewRfp.value) {
        await updateApi()
      }
      router.push({
        name: 'update-presentation',
        params: {
          presentationId: presentationId.value || 'new',
          step: SLIDE_SELECTION_STEP,
        },
      })
    }

    const presentationState = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )
    const slideIndex = computed(
      () => `${presentationId.value}-${route.params.step}`,
    )

    const rfpSlidesVersionReset = (rfp) =>
      rfp?.slides
        ?.map((slide) => ({
          ...slide,
          slide: { ...slide.slide, version: 0 },
          selected: false,
        }))
        .sort((slideA, slideB) => slideA.slideNumber - slideB.slideNumber)
        .sort((slideA, slideB) => slideA.pageNumber - slideB.pageNumber)

    const rfpUsersToCompare = (rfp) =>
      rfp?.internalUserDetails
        ?.map((user) => ({
          ...user,
          shareRfp: '',
          internalUserId: '',
          userId: '',
          name: '',
          email: user.email || '',
          role: user.role === 'NONE' ? null : user.role,
        }))
        .sort((userA, userB) =>
          `${userA.firstName}${userA.lastName}${userA.email}`.localeCompare(
            `${userB.firstName}${userB.lastName}${userB.email}`,
          ),
        )
        .filter((user) => user.role !== 'OWNER') || []

    function rfpsContentIsEqual(rfp1, rfp2) {
      const rfpUpdateType = rfpUpdateTypesPerStep[currentStep.value]

      if (rfpUpdateType === 'slides') {
        return (
          JSON.stringify(rfpSlidesVersionReset(rfp1)) ===
          JSON.stringify(rfpSlidesVersionReset(rfp2))
        )
      } else if (rfpUpdateType === 'contact') {
        return (
          isEqual(rfp1?.contact, rfp2?.contact) &&
          rfp1?.customerName === rfp2?.customerName &&
          rfp1?.customerProblem === rfp2?.customerProblem
        )
      } else if (rfpUpdateType === 'internalUserDetails') {
        return (
          isEqual(rfpUsersToCompare(rfp1), rfpUsersToCompare(rfp2)) &&
          (rfp1?.tier || '') === (rfp2?.tier || '')
        )
      } else {
        return isEqual(rfp1?.[rfpUpdateType], rfp2?.[rfpUpdateType])
      }
    }

    const {
      apiError: versionError,
      updateValue: updateApiFunc,
      isUpdating,
    } = versionedApiUpdate({
      initialLocalValue: () =>
        route.params.presentationId
          ? presentationState.value
          : emptyCurrentRfp.value,
      updateLocalValue: () => {},
      updateRemoteValue: saveChanges,
      currentValueIndex: slideIndex,
      localRemoteValuesIsEqual: rfpsContentIsEqual,
    })

    const updateApi = async () => await updateApiFunc(presentationState.value)

    const editIsDisallowed = useRfpEditIsDisabled()

    watch(
      presentationState,
      (newPresentationState, oldPresentationState) => {
        if (
          oldPresentationState &&
          !rfpsContentIsEqual(newPresentationState, oldPresentationState) &&
          !editIsDisallowed.value &&
          !isNewRfp.value
        ) {
          updateApi()
        }
      },
      {
        deep: true,
        immediate: false,
      },
    )

    router.beforeEach(async (to) => {
      if (
        currentStep.value === 1 &&
        isNewRfp.value &&
        to.params.presentationId === 'new'
      ) {
        await updateApi()
        if (to.name === 'builder' || to.name === 'update-presentation') {
          if (!presentationId.value) {
            versionError.value =
              versionError.value || 'Please Enter Customer Name'
            return false
          }
          to.params.presentationId = presentationId.value
          return to
        }
      }
    })

    const scrollToTop = () => {
      window.scrollTo(0, 0)
    }

    router.afterEach(() => {
      if (currentStep.value === OVERVIEW_STEP) scrollToTop()
    })

    const skipSlideGaLog = () => {
      gaEvent({
        action: 'skip-to-slides-button-click',
        event_category: 'dashboard',
        event_label: 'User-clicked-skip-to-slides-button',
      })
    }

    return {
      step: currentStep,
      isNewRfp,
      isUpdating,
      title,
      next,
      previous,
      skipToSlides,
      SLIDE_SELECTION_STEP,
      OVERVIEW_STEP,
      TOTAL_STEPS,
      versionError,
      skipSlideGaLog,
    }
  },
}
</script>

<style lang="postcss">
.bordered-dp-button {
  padding-top: calc(1rem - 1px);
  padding-bottom: calc(1rem - 1px);
}
</style>
