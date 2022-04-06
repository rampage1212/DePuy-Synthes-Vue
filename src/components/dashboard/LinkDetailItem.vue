<template>
  <div class="flex flex-col border-b">
    <div
      class="flex flex-col text-left border-l-2 border-blue-650 py-3 ml-8 pl-8"
    >
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">
          {{ link.linkName }}
        </h1>
        <div class="flex space-x-2 items-center">
          <SvgIcon class="h-5 w-5 text-primary" name="view" />

          <h1 class="text-sm text-gray-425">{{ link.viewCount }}</h1>
        </div>
      </div>
      <h2 class="text-sm text-gray-425 font-medium opacity-70">
        Last updated on {{ updatedOn || '...' }}
      </h2>
      <div class="flex space-x-4 pt-3">
        <dp-button
          class="px-4 bg-white text-accent-blue py-2 border-accent-blue border-2 rounded-lg"
          text="Copy Email"
          @click="copyEmailBody"
        />
        <DpLinkButton
          class="px-4 bg-primary border-2 border-primary rounded-lg text-white"
          :to="{
            name: 'present-pdf',
            params: {
              hyperLink: link.hyperLink,
              clientName: link.clientName,
            },
          }"
          target="_blank"
          text="Save PDF"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DpButton from '@/components/buttons/DpButton.vue'
import DpLinkButton from '@/components/buttons/DpLinkButton.vue'
import { formatDate } from '@/utils/formatDate'
import { copyHtmlString } from '@/utils/strings'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    DpButton,
    DpLinkButton,
  },
  props: { link: { type: Object, required: true } },
  setup(props) {
    const store = useStore()

    const updatedOn = computed(() =>
      props.link.updatedDate ? formatDate(props.link.updatedDate) : '',
    )

    const emailBody = computed(() =>
      store.getters['setting/populatedEmailBody'](props.link),
    )

    const copyEmailBody = () => {
      copyHtmlString(emailBody.value)
    }

    return {
      updatedOn,
      copyEmailBody,
    }
  },
}
</script>
