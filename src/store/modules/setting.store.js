import { getUser, createUser, updateUser } from '@/api/user.api.js'
import { defaultEmailBody } from '@/data/defaultSetting.js'
import { gaEvent } from '@/utils/GA_Event.js'

export default {
  state: {
    // userID: 'us-east-1:77254f14-c68c-4af8-b6c8-42a9dbcdacc6',
    emailBody: '',
    firstName: '',
    lastName: '',
    id: '',
  },
  getters: {
    emailBody(state, getters) {
      return state.emailBody || (getters.userId ? getters.defaultEmailBody : '')
    },

    populatedEmailBody: (state, getters) => (link) => {
      let replacedEmailBody = getters.emailBody.replace(
        '{passcode}',
        link.passCode,
      )
      replacedEmailBody = replacedEmailBody.replace(
        '{link}',
        `${window.location.origin}/slide/${link.hyperLink}`,
      )
      return replacedEmailBody
    },

    getFirstName(state) {
      return state.firstName
    },
    getLastName(state) {
      return state.lastName
    },
    userId(state) {
      return state.id
    },
    defaultEmailBody(state, getters, rootState, rootGetters) {
      return defaultEmailBody({ ...state, email: rootGetters['auth/email'] })
    },
  },
  mutations: {
    setEmailBody(state, payload) {
      state.emailBody = payload
    },
    setFirstName(state, payload) {
      state.firstName = payload
    },
    setLastName(state, payload) {
      state.lastName = payload
    },
    setEmail(state, payload) {
      state.email = payload
    },
    setUser(state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.emailBody = payload.emailBody
      state.id = payload.id
    },
  },
  actions: {
    async fetchUser(
      { state, commit, dispatch, rootGetters, getters },
      refetchIfExists = true,
    ) {
      gaEvent({
        action: 'fetch-user',
        event_category: 'settting',
        event_label: 'User-fetch-user',
      })

      try {
        if (!refetchIfExists && state.id) return state

        const { err } = await dispatch(
          'auth/fetchUserDetail',
          refetchIfExists,
          {
            root: true,
          },
        )
        if (err) throw err
        const userDetail = rootGetters['auth/userDetail']
        let receiveduser = await getUser(userDetail.email, userDetail.userID)
        commit('setUser', receiveduser)

        if (!receiveduser.userId)
          receiveduser = await dispatch('updateUser', {}) // this sets userId

        return receiveduser
      } catch (err) {
        if (err.status) {
          const userDetail = rootGetters['auth/userDetail']
          // todo: remove 400
          if (err.status === 404 || err.status === 400) {
            const createdUser = await createUser({
              userId: userDetail.userID,
              email: userDetail.email,
              firstName: state.firstName,
              lastName: state.lastName,
              emailBody: state.emailBody || getters.defaultEmailBody,
            })
            commit('setUser', createdUser)
            return createdUser
          } else {
            throw err
          }
        } else {
          throw err
        }
      }
    },
    async updateUser(
      { state, commit, getters, rootGetters },
      { firstName, lastName, emailBody },
    ) {
      gaEvent({
        action: 'update-user',
        event_category: 'settting',
        event_label: 'User-update-user',
      })
      try {
        const userDetail = rootGetters['auth/userDetail']

        const updatedUser = await updateUser({
          email: userDetail.email,
          emailBody: emailBody || state.emailBody || getters.defaultEmailBody,
          firstName: firstName || state.firstName,
          id: state.id,
          lastName: lastName || state.lastName,
          userId: userDetail.userID,
        })
        commit('setUser', updatedUser)

        return updatedUser
      } catch (err) {
        console.error(err.response || err)
        throw err
      }
    },
  },
}
