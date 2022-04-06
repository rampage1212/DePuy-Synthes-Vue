<template>
  <tr>
    <td>
      <input
        v-model.lazy="data.userType"
        class="min-w-28 w-full"
        placeholder="Enter role here"
        :disabled="editIsDisallowed"
      />
    </td>
    <td>
      <input
        v-model.lazy="data.name"
        class="min-w-28 w-full"
        placeholder="Enter name here"
        :disabled="editIsDisallowed"
      />
    </td>
    <td>
      <input
        v-model.lazy="data.email"
        class="min-w-28 w-full :"
        :class="{
          'border border-red-300':
            (!data.email && data.shareRfp) || invalidEmail,
        }"
        type="email"
        placeholder="Enter email here"
        :disabled="editIsDisallowed"
      />
    </td>
    <td>
      <div class="space-x-3 pr-4">
        <div v-if="isOverview">{{ data.shareRfp ? 'Yes' : 'No' }}</div>
        <div v-else class="flex">
          <div class="flex items-center space-x-1 pr-1">
            <input
              :id="`shareRfpYes${index}`"
              v-model="data.shareRfp"
              :name="`shareRfp${index}`"
              class="radio-input my-auto"
              type="radio"
              :value="true"
              :disabled="editIsDisallowed"
            />
            <label
              :for="`shareRfpYes${index}`"
              class="text-normal text-gray-450 my-auto"
              >Yes
            </label>
          </div>
          <div class="flex items-center space-x-1">
            <input
              :id="`shareRfpNo${index}`"
              v-model="data.shareRfp"
              :name="`shareRfp${index}`"
              class="radio-input my-auto"
              type="radio"
              :value="false"
              :disabled="editIsDisallowed"
            />
            <label
              :for="`shareRfpNo${index}`"
              class="text-normal text-gray-450 my-auto"
              >No
            </label>
          </div>
        </div>
      </div>
    </td>
    <td>
      <div class="space-x-3">
        <div v-if="isOverview">
          <div v-if="data.shareRfp">
            {{ data.role == 'VIEWER' ? 'View' : 'Edit' }}
          </div>
        </div>
        <!-- use d-none to avoid page shift horizontally -->
        <div v-else class="flex" :class="!data.shareRfp ? 'opacity-0' : ''">
          <div class="flex items-center space-x-1 pr-1">
            <input
              :id="`viewAccessRole${index}`"
              v-model="data.role"
              :name="`accessRole${index}`"
              class="radio-input my-auto checked:bg-red-700"
              type="radio"
              value="VIEWER"
              :disabled="editIsDisallowed"
            />
            <label
              :for="`viewAccessRole${index}`"
              class="text-normal text-gray-450 my-auto"
              >View
            </label>
          </div>
          <div class="flex items-center space-x-1">
            <input
              :id="`editAccessRole${index}`"
              v-model="data.role"
              :name="`accessRole${index}`"
              class="radio-input my-auto"
              type="radio"
              value="EDITOR"
              :disabled="editIsDisallowed"
            />
            <label
              :for="`editAccessRole${index}`"
              class="text-normal text-gray-450 my-auto"
              >Edit
            </label>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>
<script>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'

export default {
  props: {
    member: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  emits: ['updateMember'],

  setup(props, { emit }) {
    const data = ref({
      ...props.member,
      name: [props.member.firstName, props.member.lastName]
        .filter(Boolean)
        .join(' '),
    })
    const route = useRoute()
    const isOverview = computed(() => route.params.step === '7')

    const editIsDisallowed = useRfpEditIsDisabled()

    const invalidEmail = computed(() => {
      const validEmailFormat =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return (
        data.value.email &&
        !validEmailFormat.test(String(data.value.email).toLowerCase())
      )
    })

    watch(
      () => data,
      (newData) => {
        const updatedMember = { ...newData.value }
        if (!updatedMember.shareRfp) updatedMember.role = 'NONE'

        const names = updatedMember.name?.split(' ')

        updatedMember.firstName = names.slice(0, -1).join(' ')
        updatedMember.lastName = names.slice(-1).join(' ')

        if (!updatedMember.email) {
          updatedMember.email = ''
          // updatedMember.shareRfp = false
        }

        updatedMember.role =
          updatedMember.shareRfp && updatedMember.role == 'NONE'
            ? 'VIEWER'
            : updatedMember.role
        emit('updateMember', updatedMember, props.index)
      },
      { deep: true },
    )

    return {
      data,
      isOverview,
      editIsDisallowed,
      invalidEmail,
    }
  },
}
</script>

<style scoped lang="postcss">
input {
  @apply text-base font-bold leading-relaxed py-4 px-3 rounded-lg bg-gray-50;
}
input:disabled {
  background-color: white;
}

th {
  @apply py-3 text-base font-normal font-Arial;
}
</style>
