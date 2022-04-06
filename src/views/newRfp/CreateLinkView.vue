<template>
  <page-wrapper title="">
    <builder-header />
    <base-card
      class="min-h-screen border-none rounded-3xl py-7 divide-x justify-between"
    >
      <div class="flex flex-col space-y-8 w-auto">
        <router-link
          class="flex space-x-4 items-center mr-auto"
          :to="{
            name: 'builder',
            params: {
              presentationId: presentationId,
              slideId: lastBuilderPage,
            },
          }"
        >
          <SvgIcon name="left_arrow_2" class="text-primary w-6 h-6" />
          <h1 class="text-primary text-2xl font-medium">Presentation</h1>
        </router-link>
        <div
          v-if="rfpLinks?.length > 0"
          class="flex border-y space-x-4 items-center overflow-x-auto w-full pr-2"
        >
          <router-link
            v-for="link in rfpLinks"
            :key="link.linkId"
            :to="{
              name: 'update-link',
              params: {
                linkId: link.id,
                presentationId: link.presentationId,
              },
            }"
          >
            <h1
              class="py-3 px-3 cursor-pointer"
              :class="
                activeLink?.id === link.id
                  ? 'bg-accent-blue text-white'
                  : 'bg-white text-gray-875'
              "
            >
              {{ link.hyperLink }}
            </h1>
          </router-link>
          <dp-button
            text="+"
            class="bg-primary h-10 flex items-center text-2xl rounded-lg text-white"
            :disabled="editIsDisallowed"
            @click="createNewLink"
          />
        </div>
        <slide-items-group
          v-for="category in categories"
          :key="category"
          :category-slides="slidesByCategory[category]"
          :category="category"
        />
      </div>
      <link-form :slides="slides" />
    </base-card>
  </page-wrapper>
</template>

<script>
import BaseCard from '@/components/utils/container/BaseCard.vue'
import PageWrapper from '@/components/utils/container/PageWrapper.vue'
import LinkForm from '@/components/newRfp/LinkForm.vue'
import SlideItemsGroup from '@/components/newRfp/SlideItemsGroup.vue'
import builderHeader from '@/components/builder/wizardHeader.vue'
import DpButton from '@/components/buttons/DpButton.vue'
import { computed } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
import { useRfpEditIsDisallowed } from '@/utils/useRfpEditIsDisabled.js'
import { groupSlides } from '@/data/allSlides.js'

export default {
  components: {
    PageWrapper,
    BaseCard,
    builderHeader,
    LinkForm,
    DpButton,
    SlideItemsGroup,
  },

  setup() {
    const store = useStore()
    const route = useRoute()

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )
    const rfpLinks = computed(() =>
      store.getters['link/getLinksByPresentationId'](
        route.params.presentationId,
      ),
    )

    onMounted(async () => {
      store.dispatch('rfps/getMyRfpbyId', route.params.presentationId)

      if (!rfpLinks.value?.length) {
        await store.dispatch('link/fetchRfpLinks', route.params.presentationId)
      }
    })

    const activeLink = computed(() =>
      rfpLinks.value?.find((link) => link.id == route.params.linkId),
    )

    const slides = computed(() =>
      JSON.parse(
        JSON.stringify(
          activeLink.value?.slides || presentation.value?.slides || [],
        ),
      ),
    )

    const slidesByCategory = computed(() => groupSlides(slides.value))
    let categories = computed(() => Object.keys(slidesByCategory.value))

    const router = useRouter()
    const createNewLink = () => {
      router.push({
        name: 'create-link',
        params: {
          presentationId:
            presentation.value?.presentationId || route.params.presentationId,
        },
      })
    }
    const editIsDisallowed = useRfpEditIsDisallowed()

    const lastBuilderPage = computed(() =>
      store.getters['rfps/getLastBuilderPage'](route.params.presentationId),
    )

    return {
      rfpLinks,
      activeLink,
      slides,
      createNewLink,
      editIsDisallowed,
      presentationId: route.params.presentationId,
      categories,
      slidesByCategory,
      lastBuilderPage,
    }
  },
}
</script>
