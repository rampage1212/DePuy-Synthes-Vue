<template>
  <table class="w-full">
    <thead class="text-left text-xs font-medium tracking-wider w-full">
      <tr :class="isOverview ? 'bg-blue-555 text-white' : ''">
        <th :class="isOverview ? 'rounded-tl-xl  pl-2' : ''" scope="col">
          Role
        </th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Share Presentation?</th>
        <th :class="isOverview ? 'rounded-tr-xl' : ''" scope="col">
          Access Role
        </th>
      </tr>
    </thead>
    <tbody>
      <internal-team-row
        v-for="(member, index) in teamData"
        :key="index"
        :member="member"
        :index="index"
        @update-member="updateTeamData"
      />
    </tbody>
  </table>
  <dp-button
    v-if="!isOverview"
    type="button"
    text="+ Add more"
    class="py-4 border border-dashed w-1/2 rounded-md font-medium text-gray-800 mt-6"
    :disabled="editIsDisallowed"
    @click="teamData.push({})"
  />
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import DpButton from '../buttons/DpButton.vue'
import InternalTeamRow from './InternalTeamRow.vue'
import { computed, ref } from 'vue'
import { useRfpEditIsDisabled } from '@/utils/useRfpEditIsDisabled.js'

const DEFAULT_ROLES = [
  'REGIONAL MANAGER',
  'TEAM LEAD (AVP, DSA)',
  'CONTRACT DIRECTOR',
  'DEAL DESK',
  'COMMERCIAL EXECUTION',
  'CAPABILITIES',
  'HEMA',
  'SUPPLY CHAIN',
]

export default {
  components: { DpButton, InternalTeamRow },

  setup() {
    const store = useStore()
    const route = useRoute()

    const presentation = computed(() =>
      store.getters['rfps/getPresentationById'](route.params.presentationId),
    )
    const isOverview = computed(() => route.params.step === '7')

    const editIsDisallowed = useRfpEditIsDisabled()

    const internalUserDetails = computed(() => {
      let teamData =
        presentation.value?.internalUserDetails?.map((user) => ({
          ...user,
          name: user.firstName ? `${user.firstName} ${user.lastName}` : '',
        })) || []
      // add default role if there is no user of that role
      DEFAULT_ROLES.forEach((defaultUserType) => {
        let user = teamData.find(
          (userItem) => userItem.userType == defaultUserType,
        )
        if (!user)
          teamData.push({
            userType: defaultUserType,
            role: 'NONE',
            shareRfp: null,
          })
      })

      return teamData
    })

    const allTeamData = ref(
      internalUserDetails.value
        .filter(({ role }) => role !== 'OWNER')
        .map((user) => ({ ...user })),
    )

    const populatedTeamData = computed(() => {
      return allTeamData.value
        .map((user) => ({
          ...user,
          email: user.email || null,
          role: user.role || 'NONE',
        }))
        .filter(
          ({ email, firstName, lastName }) => email || firstName || lastName,
        )
    })
    const teamData = isOverview.value ? populatedTeamData : allTeamData

    const updateTeamData = (updatedUser, index) => {
      const oldUser = { ...teamData.value[index] }

      if (
        (oldUser.internalUserId || oldUser.userId) &&
        oldUser.email !== updatedUser.email
      ) {
        // this is a different user in the db
        updatedUser.userId = null
        updatedUser.internalUserId = null
      }

      teamData.value.splice(index, 1, updatedUser)

      const validEmailFormat =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      let allEmailsAreValid = true
      populatedTeamData.value.forEach(({ email, shareRfp }) => {
        if (email && !validEmailFormat.test(String(email).toLowerCase())) {
          allEmailsAreValid = false
        }
        if (!email && shareRfp) {
          allEmailsAreValid = false
        }
      })
      if (!allEmailsAreValid) return

      store.commit(
        'rfps/updateRfp',
        JSON.parse(
          JSON.stringify({
            ...presentation.value,
            internalUserDetails: populatedTeamData.value,
          }),
        ),
      )
    }

    return {
      teamData,
      updateTeamData,
      isOverview,
      editIsDisallowed,
    }
  },
}
</script>

<style scoped lang="postcss">
input {
  @apply text-base font-bold leading-relaxed py-4 px-3 rounded-lg bg-gray-50;
}

th {
  @apply py-3 text-base font-normal font-Arial;
}
</style>
