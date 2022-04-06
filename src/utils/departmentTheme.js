import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default function useDepartmentTheme() {
  const route = useRoute()

  const departmentTheme = computed(
    () => `theme-${route.params.department || 'default'}`,
  )

  return departmentTheme
}
