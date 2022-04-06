<template>
  <div class="relative min-h-screen flex">
    <button
      v-if="isBuilder"
      class="absolute z-20 w-6 left-8 top-6"
      @click="showSideNav = !showSideNav"
    >
      <img
        src="@/assets/logo/ShowHiddenButton.svg"
        alt="show side navigation"
      />
    </button>
    <side-bar v-if="showSideNav || !isBuilder" />

    <main class="flex-1">
      <top-navigation :show-side-nav="showSideNav" />
      <div class="flex bg-gray-75 flex-row">
        <SideNav v-if="showUpdatedSideBar" />
        <div
          class="flex flex-col w-full min-h-screen"
          :class="showSideNav ? 'pl-0' : 'padding-75px'"
        >
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TopNavigation from '@/components/layouts/TopNavigation.vue'
import SideBar from '@/components/layouts/SideBar.vue'
import SideNav from '@/components/layouts/SideNav.vue'
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

export default {
  components: {
    TopNavigation,
    SideBar,
    SideNav,
  },
  setup() {
    const route = useRoute()
    const isUpdateRfp = computed(() => route.name === 'update-presentation')
    const isNewRfp = computed(() => route.name === 'new-presentation')
    const isBuilder = computed(() => route.name === 'builder')
    const showSideNav = ref(true)

    const showUpdatedSideBar = computed(
      () => isNewRfp.value || isUpdateRfp.value || !showSideNav.value,
    )

    return {
      isBuilder,
      showSideNav,
      showUpdatedSideBar,
    }
  },
}
</script>

<style scoped>
.padding-75px {
  padding-left: 75px;
}
</style>

<style lang="postcss">
.main-page-table-header {
  @apply bg-gray-75
          text-left text-xs
          font-bold
          uppercase
          w-full
          rounded-lg;
}
.main-page-table-header tr th {
  @apply py-2;
}
.main-page-table-header tr th:first-child {
  @apply rounded-l-lg;
}
.main-page-table-header tr th:last-child {
  @apply rounded-r-lg;
}
</style>
