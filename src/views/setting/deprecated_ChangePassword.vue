<template>
  <page-wrapper title="Settings">
    <headerBreadCrumps page-name="Settings" :links="[]" />
    <base-card
      class="flex flex-col w-full space-y-5 p-0 rounded-2xl"
      :card-style="'py-4 bg-white'"
    >
      <tab-panel :tab-items="tabItems" :active-item="'Change Password'" />
      <ChangePassword />
    </base-card>
  </page-wrapper>
</template>

<script>
import TabPanel from '@/components/setting/TabPanel.vue'
import ChangePassword from '@/components/setting/deprecated_ChangePassword.vue'
import PageWrapper from '@/components/utils/container/PageWrapper.vue'
import headerBreadCrumps from '@/components/utils/headerBreadCrumps.vue'
import BaseCard from '@/components/utils/container/BaseCard.vue'

const TAB_ITEMS = [
  {
    title: 'Profile',
    link: 'settings-profile',
  },
  {
    title: 'Email Body',
    link: 'settings-email-body',
  },
  {
    title: 'Custom Slides',
    link: 'settings-custom-slides',
  },
  {
    title: 'Change Password',
    link: 'settings-change-password',
  },
]

export default {
  components: {
    TabPanel,
    PageWrapper,
    ChangePassword,
    BaseCard,
    headerBreadCrumps,
  },
  setup() {
    const tabItems = TAB_ITEMS

    return {
      tabItems,
    }
  },
}
</script>
