import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export function useRfpEditIsDisallowed(presentationId) {
  const store = useStore()
  const route = useRoute()

  const presentation = computed(() =>
    store.getters['rfps/getPresentationById'](
      presentationId || route.params.presentationId,
    ),
  )

  const userId = computed(() => store.getters['auth/userID'])

  const userInternalId = computed(() => store.getters['setting/userId'])

  const role = computed(
    () =>
      presentation.value?.internalUserDetails?.find(
        (user) =>
          user.userId === userId.value || user.userId === userInternalId.value,
      )?.role,
  )

  const editIsDisallowed = computed(
    () =>
      Boolean(role.value) &&
      !(
        role.value == 'EDITOR' ||
        role.value == 'OWNER' ||
        presentation.value?.owner == userInternalId.value
      ),
  )

  return editIsDisallowed
}

export function useRfpEditIsDisabled() {
  const route = useRoute()
  const isOverview = computed(() => route.params.step === '7')
  const editIsDisallowed = useRfpEditIsDisallowed()

  const editIsDisabled = computed(
    () => isOverview.value || editIsDisallowed.value,
  )

  return editIsDisabled
}
