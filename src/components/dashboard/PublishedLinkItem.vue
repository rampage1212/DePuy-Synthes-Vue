<template>
  <button
    class="flex py-3 space-x-3 pl-3 pr-2 focus:outline-none w-full"
    :class="showDetail ? 'bg-blue-650 bg-opacity-10' : ''"
    @click=";(showDetail = !showDetail), publishedLinkDetailTogGalog()"
  >
    <CustomerLogo
      class="my-auto w-20 h-16 border rounded-xl"
      :presentation-id="presentationId"
      :name="clientName"
    />
    <div class="flex flex-col flex-grow text-left space-y-1">
      <h3 class="text-lg font-bold">
        {{ clientName }}
      </h3>
      <h4 class="text-sm">
        <!-- {{ TODO: presentation.date }} -->
        <!--        Aug 3, 2021 -->
      </h4>
      <div class="flex space-x-8">
        <div class="flex space-x-2">
          <SvgIcon class="h-5 w-5" name="attachment" />
          <h1 class="text-sm text-gray-425">
            {{ links.length }}
          </h1>
        </div>
        <div class="flex space-x-2 items-center">
          <SvgIcon class="h-5 w-5 text-primary" name="view" />
          <h1 class="text-sm text-gray-425">
            {{ links.length }}
          </h1>
        </div>
      </div>
    </div>
    <div class="flex relative">
      <button
        class="p-3 h-10 bg-gray-50 rounded-lg items-center"
        @click.stop="showMenu = !showMenu"
        @blur="delay(() => (showMenu = false))"
      >
        <SvgIcon class="h-5 w-1" name="moreVertical" />
      </button>
      <div v-if="showMenu" class="absolute right-0 top-11 z-50">
        <link-menu class="shadow-xl" :presentation-id="presentationId" />
      </div>
    </div>
  </button>
  <published-link-detail v-if="showDetail" :links="links" />
</template>

<script>
import { ref } from '@vue/reactivity'
import PublishedLinkDetail from './PublishedLinkDetail.vue'
import CustomerLogo from '@/components/utils/s3/CustomerLogo.vue'
import LinkMenu from './LinkMenu.vue'
import { computed } from '@vue/runtime-core'
import { gaEvent } from '@/utils/GA_Event.js'

export default {
  components: {
    PublishedLinkDetail,
    LinkMenu,
    CustomerLogo,
  },
  props: {
    links: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showDetail = ref(false)
    const showMenu = ref(false)

    const clientName = computed(() => props.links?.[0].clientName)
    const presentationId = computed(() => props.links?.[0].presentationId)

    const delay = (func) => setTimeout(func, 1000)

    const publishedLinkDetailTogGalog = () => {
      gaEvent({
        action: 'published-link-detail-toggler-in-dashboard-click',
        event_category: 'dashboard',
        event_label:
          'User-clicked-published-link-detail-toggler-in-dashboard-button',
      })
    }

    return {
      clientName,
      presentationId,
      showDetail,
      showMenu,
      delay,
      publishedLinkDetailTogGalog,
    }
  },
}
</script>
