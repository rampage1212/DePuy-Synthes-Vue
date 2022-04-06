<template>
  <app-icon
    v-if="!sideMenuShown"
    class="absolute top-0 left-0"
    :class="isBuilder ? 'left-20' : 'left-0'"
  />
  <div :class="!sideMenuShown ? 'pl-56' : 'ml-12'">
    <div
      class="border-b px-4 flex justify-between items-center h-16 border-l-0"
      :class="showSideNav ? 'ml-0' : 'ml-20'"
    >
      <!-- top bar left -->
      <div class="flex items-left flex-grow pr-2">
        <SvgIcon class="w-5 h-5 my-auto" name="search" />
        <input
          v-model.lazy="searchTerm"
          class="text-sm placeholder:text-gray-400 py-1 px-2 my-auto min-w-72 h-full flex-grow outline-gray-200"
          placeholder="Search ..."
        />
      </div>
      <div v-if="isBuilder" class="flex">
        <ResSidebar />

        <button
          target="_blank"
          :to="{}"
          class="border-red-700 items-center text-red-700 py-2 px-4 mr-3 border-2 rounded-lg h-12 min-w-28 text-center"
        >
          Export
        </button>
        <dp-link-button
          v-if="previewUrl"
          target="_blank"
          :to="previewUrl"
          class="bg-accent-purple flex items-center text-white py-2 px-4 mr-3 border-accent-purple border-2 rounded-lg h-12 min-w-28"
        >
          <SvgIcon class="w-5 h-5 mr-2" name="preview" />
          Present
        </dp-link-button>
      </div>
      <!-- to bar right  -->
      <div v-else class="flex space-x-3 items-center pr-4 relative">
        <notification class="mr-2 my-auto" />
        <Avatar
          class="w-8 h-8 rounded-full"
          :user-i-d="$store.getters['auth/userID']"
          :name="fullName"
        />

        <button
          class="flex"
          @click=";(showMenu = !showMenu), topNavNameRolTogGaLog()"
        >
          <div class="flex flex-col mr-2 text-left my-auto">
            <h1
              class="text-sm font-semibold leading-none text-gray-900 min-w-28"
            >
              {{ fullName }}
            </h1>
            <h1 class="text-xs leading-3 text-gray-400"></h1>
          </div>
          <svg-icon name="dropdownTriangle" class="w-3 h-5 pt-1 my-auto" />
        </button>
        <div class="absolute right-0 top-11 z-50 w-full">
          <nav-menu v-if="showMenu" class="shadow-xl ml-14" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DpLinkButton from '@/components/buttons/DpLinkButton.vue'
import NavMenu from './NavMenu.vue'
import Notification from './NotificationsList.vue'
import ResSidebar from '@/components/resources/ResSidebar.vue'
import appIcon from './appIcon.vue'
import SvgIcon from '@/components/utils/SvgIcon.vue'
import Avatar from '@/components/utils/s3/UserAvatar.vue'
import { ref } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { gaEvent } from '@/utils/GA_Event.js'

export default {
  components: {
    appIcon,
    DpLinkButton,
    SvgIcon,
    NavMenu,
    ResSidebar,
    Notification,
    Avatar,
  },
  props: {
    showSideNav: { type: Boolean, required: true },
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const showMenu = ref(false)

    onMounted(async () => {
      try {
        await store.dispatch('setting/fetchUser', false)
      } catch (err) {
        console.error('fetch User: ', err)
      }
    })

    const fullName = computed(
      () =>
        `${store.getters['setting/getFirstName'] || ''} ${
          store.getters['setting/getLastName'] || ''
        }`,
    )

    const sideMenuShown = computed(
      () =>
        route.name !== 'builder' &&
        route.name !== 'new-presentation' &&
        route.name !== 'update-presentation',
    )

    const isBuilder = computed(() =>
      ['create-link', 'builder', 'update-link'].includes(route.name),
    )

    const presentationId = computed(() => route.params.presentationId)
    const link = computed(() =>
      store.getters['link/getLinkByLinkId'](route.params.linkId),
    )

    const previewUrl = computed(() =>
      link.value
        ? {
            name: 'present',
            // hash: `#/${slideNumber.value}`,
            params: {
              hyperLink: link.value.hyperLink,
              clientName: link.value.clientName,
            },
          }
        : presentationId.value
        ? {
            name: 'slide',
            // hash: `#/${slideNumber.value || 1}`,
            params: {
              presentationId: presentationId.value,
            },
          }
        : null,
    )

    const searchQuery = computed(() => route.query.search)
    const searchTerm = ref(searchQuery.value || '')
    watch(searchTerm, () =>
      router.push({ name: 'published', query: { search: searchTerm.value } }),
    )
    watch(searchQuery, () => {
      if (searchQuery.value !== searchTerm.value)
        searchTerm.value = searchQuery.value
    })

    const topNavNameRolTogGaLog = () => {
      gaEvent({
        action: `showMenu-dropdown-button-at-topNav-click`,
        event_category: 'dashboard',
        event_label: 'User-clicked-showMenu-dropdown-button-at-topNav',
      })
    }
    return {
      showMenu,
      sideMenuShown,
      isBuilder,
      fullName,
      searchTerm,
      topNavNameRolTogGaLog,
      previewUrl,
    }
  },
}
</script>
