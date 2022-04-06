<template>
  <base-card class="rounded-2xl p-5 flex-col space-y-3 text-left">
    <div class="flex justify-between">
      <h1 class="text-header">
        {{ draftItem.title }}
      </h1>
      <div class="relative flex">
        <button
          class="p-1 bg-gray-50 rounded-lg items-center"
          @click="dropdown(), draftItemDropdownGaLog()"
          @blur="delay(() => (showMenu = false))"
        >
          <SvgIcon class="h-6 w-6" name="moreHorizontal" />
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 top-12 z-50 borde-2 rounded-xl bg-white shadow-xl"
        >
          <div class="flex flex-col py-6 px-5 w-44 space-y-4">
            <router-link
              :to="{
                name: 'slide',
                params: {
                  presentationId: draftItem.presentationId,
                },
              }"
              target="_blank"
              class="flex items-center text-gray-425 space-x-2"
            >
              <svg-icon name="presentation" class="h-5 w-6" />
              <h1>Preview</h1>
            </router-link>

            <router-link
              :to="{
                name: 'update-presentation',
                params: {
                  presentationId: draftItem.presentationId,
                  step: 1,
                },
              }"
              class="flex items-center text-gray-425 space-x-2"
            >
              <svg-icon
                :name="editIsDisallowed.value ? 'view' : 'edit'"
                class="h-5 w-6"
              />

              <h1>{{ editIsDisallowed.value ? 'View' : 'Edit' }}</h1>
            </router-link>
            <button
              class="flex items-center text-gray-425 space-x-2"
              @click="shareModal(), draftItemShareGaLog()"
            >
              <svg-icon name="share" class="h-5 w-6" />
              <h1>Share</h1>
            </button>
            <button
              class="flex items-center text-gray-425 space-x-2"
              @click="shareWithModal(), draftItemShareWithGaLog()"
            >
              <svg-icon name="shared" class="h-5 w-6" />
              <h1>Shared with</h1>
            </button>
            <button class="flex items-center text-primary space-x-2">
              <div class="p-1 border-primary border-2 rounded-md">
                <svg-icon name="delete" class="h-5 w-6" />
              </div>
              <h1>Delete</h1>
            </button>
          </div>
        </div>
        <share-with-modal
          v-if="shareFlag"
          :rfp="draftItem"
          :store-name="shareWithStore"
          @hide="shareModal"
        />
        <share-modal
          v-if="showSharedWithModal"
          :presentation-id="draftItem.presentationId"
          @hide="shareWithModal"
        />
      </div>
    </div>

    <div class="flex space-x-2 items-center">
      <CustomerLogo
        class="h-8 w-8 border rounded-xl"
        :presentation-id="draftItem.presentationId"
        :name="draftItem.customerName"
      />
      <h1>{{ draftItem.customerName }}</h1>
    </div>
    <div class="flex space-x-8">
      <div class="flex space-x-2 items-center">
        <SvgIcon class="h-5 w-5 text-primary" name="presentation" />

        <h1 class="text-sm text-gray-425">
          {{ draftItem.enabledSlidesCount }}/{{ draftItem.totalSlidesCount }}
        </h1>
      </div>
      <div class="flex space-x-2">
        <SvgIcon class="h-5 w-5" name="attachment" />

        <h1 class="text-sm text-gray-425">
          {{ draftItem.publicationCount }}
        </h1>
      </div>
    </div>
    <div class="flex-col">
      <h1 class="text-right text-gray-500">{{ countUserInputedProgress }}%</h1>
      <div
        class="rounded-sm border-emerald-400"
        :class="countUserInputedSteps == 0 ? 'border-0' : 'border-2'"
        :style="{ width: countUserInputedProgress + '%' }"
      />
    </div>
    <h1 v-if="displayInternalTeam.length > 0">Internal Team</h1>
    <div class="flex space-x-2">
      <avatar
        v-for="member in displayInternalTeam"
        :key="member.email"
        :user-i-d="member.userId"
        :name="`${member.firstName} ${member.lastName}`"
        class="w-8 h-8"
      />

      <button @click="shareWithModal()">
        <hidden-users-count
          v-if="nonDisplayedUserCount > 0"
          :count="`${nonDisplayedUserCount}`"
          class="w-8 h-8"
        />
      </button>
    </div>
  </base-card>
</template>
<script>
import BaseCard from '@/components/utils/container/BaseCard.vue'
import Avatar from '@/components/utils/s3/UserAvatar.vue'
import HiddenUsersCount from '@/components/utils/s3/HiddenUsersCount.vue'
import ShareWithModal from '@/components/share/ShareWithModal.vue'
import ShareModal from '@/components/myRfp/ShareModal.vue'
import CustomerLogo from '@/components/utils/s3/CustomerLogo.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { gaEvent } from '@/utils/GA_Event.js'
import { useRfpEditIsDisallowed } from '@/utils/useRfpEditIsDisabled.js'
export default {
  components: {
    BaseCard,
    Avatar,
    HiddenUsersCount,
    CustomerLogo,
    ShareWithModal,
    ShareModal,
  },
  props: {
    draftItem: { type: Object, required: true },
  },

  setup(props) {
    const internalTeam = computed(() => props.draftItem.internalUserDetails)
    const showSharedWithModal = ref(false)
    const shareFlag = ref(false)
    const showMenu = ref(false)
    const showIcon = ref(false)
    const store = useStore()
    const presentationId = computed(() => props.draftItem.presentationId)

    const editIsDisallowed = computed(() =>
      useRfpEditIsDisallowed(presentationId.value),
    )

    const countUserInputedSteps = computed(() =>
      store.getters['rfps/getInputedStepsCounts'](presentationId.value),
    )
    const shareWithStore = ref('rfps/sharedWithAction')
    const shareWithModal = () => {
      showSharedWithModal.value = !showSharedWithModal.value
      showMenu.value = false
    }
    const shareModal = () => {
      shareFlag.value = !shareFlag.value
      showMenu.value = false
    }
    const dropdown = () => {
      showMenu.value = !showMenu.value
      shareFlag.value = false
      showSharedWithModal.value = false
    }
    const delay = (func) => setTimeout(func, 1000)
    const draftRfps = computed(() => store.getters['rfps/getDraftRfps'])

    const sharedWith = computed(
      () =>
        props.draftItem.internalUserDetails?.filter(
          (user) => user.role !== 'OWNER' && user.role !== 'NONE',
        ) || [],
    )

    const draftItemDropdownGaLog = () => {
      gaEvent({
        action: 'recent-drafts-in-dashboard-dropdown-click',
        event_category: 'dashboard',
        event_label: 'User-clicked-recent-drafts-in-dashboard-dropdown',
      })
    }

    const draftItemShareGaLog = () => {
      gaEvent({
        action: 'recent-drafts-in-dashboard-share-click',
        event_category: 'dashboard',
        event_label: 'User-clicked-recent-drafts-in-dashboard-share-icon',
      })
    }

    const draftItemShareWithGaLog = () => {
      gaEvent({
        action: 'recent-drafts-in-dashboard-sharedWith-click',
        event_category: 'dashboard',
        event_label: 'User-clicked-recent-drafts-in-dashboard-sharedWith-icon',
      })
    }
    const countUserInputedProgress = computed(() =>
      Math.round((countUserInputedSteps.value / 9) * 100),
    )

    const visibleUsersCount = 4
    const displayInternalTeam = computed(() =>
      sharedWith.value.slice(
        0,
        Math.min(internalTeam.value.length, visibleUsersCount),
      ),
    )
    const nonDisplayedUserCount = computed(
      () => internalTeam.value.length - visibleUsersCount,
    )

    return {
      showSharedWithModal,
      internalTeam,
      nonDisplayedUserCount,
      displayInternalTeam,
      shareWithModal,
      shareFlag,
      shareModal,
      delay,
      showMenu,
      dropdown,
      showIcon,
      draftRfps,
      sharedWith,
      shareWithStore,
      countUserInputedSteps,
      draftItemDropdownGaLog,
      draftItemShareGaLog,
      draftItemShareWithGaLog,
      countUserInputedProgress,
      editIsDisallowed,
    }
  },
}
</script>
