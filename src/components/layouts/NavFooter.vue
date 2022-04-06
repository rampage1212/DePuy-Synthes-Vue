<template>
  <div
    class="flex fixed bottom-0 left-auto pt-2 px-5"
    :class="sideMenuShown ? 'pb-2' : 'pb-1'"
  >
    <img
      v-if="sideMenuShown"
      class="w-44"
      src="@/assets/logo/asc_logo_expanded.png"
      alt="logo"
    />
    <img
      v-else
      class="w-8 mt-auto"
      src="@/assets/logo/asc_logo.svg"
      alt="logo"
    />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  setup() {
    const route = useRoute()
    const sideMenuShown = computed(
      () =>
        route.name !== 'builder' &&
        route.name !== 'new-presentation' &&
        route.name !== 'update-presentation',
    )

    return {
      sideMenuShown,
    }
  },
}
</script>
