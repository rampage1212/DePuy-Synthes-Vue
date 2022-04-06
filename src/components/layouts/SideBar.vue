<template>
  <!-- Sidebar -->
  <nav :class="sideMenuShown ? 'w-64' : 'w-18 mt-16'">
    <app-icon v-if="sideMenuShown" />
    <menu-section :section-data="menuItems.mainSection" />
    <menu-section :section-data="menuItems.helpSection" />
    <nav-footer v-if="showFooter" />
  </nav>
</template>
<script>
import NavFooter from './NavFooter.vue'
import MenuSection from './MenuSection.vue'
import appIcon from './appIcon.vue'
import menuItems from '@/data/menu.json'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  components: {
    MenuSection,
    NavFooter,
    appIcon,
  },
  setup() {
    const route = useRoute()

    const sideMenuShown = computed(
      () =>
        route.name !== 'builder' &&
        route.name !== 'new-presentation' &&
        route.name !== 'update-presentation',
    )

    const showFooter = computed(() => route.params.department === 'asc')

    return {
      sideMenuShown,
      menuItems,
      showFooter,
    }
  },
}
</script>
