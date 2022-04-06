<template>
  <component :is="layout" :class="departmentTheme">
    <slot />
  </component>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useDepartmentTheme from '@/utils/departmentTheme.js'

export default {
  name: 'AppLayout',
  setup() {
    const route = useRoute()
    const departmentTheme = useDepartmentTheme()
    const layout = ref()

    watch(
      () => route.meta,
      async (newMeta) => {
        layout.value = newMeta?.layout || 'layout-main'
      },
    )

    return { layout, departmentTheme }
  },
}
</script>
