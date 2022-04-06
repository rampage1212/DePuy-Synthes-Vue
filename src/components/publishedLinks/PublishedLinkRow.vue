<template>
  <tr class="">
    <td class="pr-2">
      <CustomerLogo
        :presentation-id="link.presentationId"
        class="w-28 h-16 rounded-xl border"
      />
    </td>
    <td class="px-2 text-title-jnj">
      {{ link.linkName }}
    </td>
    <td class="px-2 text-normal">
      {{ link.clientName }}
    </td>

    <td class="px-2 text-normal">
      {{ link.viewCount }}
    </td>
    <td class="px-2 text-normal">
      {{ createdDate }}
    </td>
    <td class="px-2">
      <dp-link-button
        class="bg-white text-accent-blue border-accent-blue border-2 rounded-lg py-2"
        :to="{
          name: 'present',
          params: {
            clientName: link.clientName,
            hyperLink: link.hyperLink,
          },
        }"
        target="_blank"
        text="Preview"
      />
    </td>
    <td class="px-2 justify-end">
      <div class="flex items-center justify-end">
        <dp-button
          class="px-4 bg-primary border-2 border-primary rounded-lg text-white py-2 mr-3 flex-grow"
          :text="downloadingPdf ? 'Saving ...' : 'Save PDF'"
          :disabled="downloadingPdf"
          @click="generatePdf"
        />
        <div class="relative flex">
          <button
            class="p-3 h-10 bg-gray-50 rounded-lg items-center"
            @click=";(showMenu = !showMenu), publishedLinkRowShowMenuGaLog()"
            @blur="delay(() => (showMenu = false))"
          >
            <SvgIcon class="h-5 w-1" name="moreVertical" />
          </button>
          <div class="absolute right-0 top-11 z-50">
            <LinkPublishedMenu
              v-if="showMenu"
              :presentation-id="link.presentationId"
              :link-id="link.id"
              class="shadow-xl"
            />
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { computed, ref } from 'vue'
import LinkPublishedMenu from '../dashboard/LinkPublishedMenu.vue'
import DpLinkButton from '../buttons/DpLinkButton.vue'
import DpButton from '@/components/buttons/DpButton.vue'
import CustomerLogo from '@/components/utils/s3/CustomerLogo.vue'
import { gaEvent } from '@/utils/GA_Event.js'
import { formatDate } from '@/utils/formatDate.js'
import { useStore } from 'vuex'
import { retrySaveS3File } from '@/components/utils/s3/saveS3File.js'

export default {
  components: { LinkPublishedMenu, DpLinkButton, CustomerLogo, DpButton },
  props: { link: { type: Object, required: true } },

  setup(props) {
    const store = useStore()
    const showMenu = ref(false)
    const delay = (func) => setTimeout(func, 1000)

    const publishedLinkRowShowMenuGaLog = () => {
      gaEvent({
        action: `showMenu-toggler-in-published-link-click`,
        event_category: 'dashboard',
        event_label: 'User-clicked-showMenu-toggler-icon-in-published-link',
      })
    }

    const createdDate = computed(() => formatDate(props.link.createdDate))

    const downloadingPdf = ref(false)

    const generatePdf = async () => {
      downloadingPdf.value = true
      const fileId = await store.dispatch('link/generatePdf', props.link)

      retrySaveS3File({
        s3FileName: `presentations/pdfs/${fileId}.pdf`,
        fileName: `Presentaion ${props.link.clientName} ${props.link.linkName}.pdf`,
        isDownloading: downloadingPdf,
      })
    }

    return {
      showMenu,
      delay,
      publishedLinkRowShowMenuGaLog,
      createdDate,
      generatePdf,
      downloadingPdf,
    }
  },
}
</script>

<style scoped lang="postcss">
td {
  @apply py-3;
}
</style>
