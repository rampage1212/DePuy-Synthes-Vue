import {
  completeNewPassword,
  forgotPassword,
  changepassword,
  signin,
  signout,
  currentAuthenticatedUser,
  Auth,
} from '@/api/httpClient.js'
import { gaEvent } from '@/utils/GA_Event.js'

const getDefaultState = () => {
  return {
    status: '', // posibble values: LOGGED_OUT, LOGGED_IN, LOADING, ERROR
    userDetail: {}, // current
    authResponse: {},
  }
}
export default {
  state: {
    status: '', // posibble values: LOGGED_OUT, LOGGED_IN, LOADING, ERROR
    userDetail: {}, // current user
    authResponse: {
      challengeName: '',
    },
    s3LastUploadedPath: '',
  },

  getters: {
    userDetail(state) {
      return state.userDetail
    },

    userID(state) {
      return state.userDetail.userID
    },

    email(state) {
      return state.userDetail.email
    },

    status(state) {
      return state.status
    },

    authResponse(state) {
      return state.authResponse
    },

    s3LastUploadedPath(state) {
      return state.s3LastUploadedPath
    },
  },

  mutations: {
    setUserDetail(state, payload) {
      state.userDetail = JSON.parse(JSON.stringify(payload))
    },
    setUser(state, payload) {
      state.setUser = payload
    },

    setStatus(state, payload) {
      state.status = payload
    },

    resetState(state) {
      Object.assign(state, getDefaultState())
    },

    setAuthResponse(state, payload) {
      state.authResponse = payload
    },

    setS3LastUploadedPath(state, url) {
      state.s3LastUploadedPath = url
    },
  },

  actions: {
    async signIn({ commit }, payload) {
      gaEvent({
        action: 'login',
        event_category: 'engagement',
        event_label: 'User-logged in',
      })
      let response = await signin(payload.username, payload.password)
      commit('setAuthResponse', response)
    },

    async completeNewPassword({ commit, state }, payload) {
      gaEvent({
        action: 'complete-new-password',
        event_category: 'engagement',
        event_label: 'User-complete-new-password',
      })
      let response = await completeNewPassword(
        state.authResponse, // todo: deepcopy this state
        payload.newPassword,
      )

      commit('setAuthResponse', response)
    },

    async forgotPassword({ commit }, payload) {
      gaEvent({
        action: 'forgot-password',
        event_category: 'engagement',
        event_label: 'User-forgot-password-clicked',
      })
      let response = await forgotPassword(payload.email)

      commit('setAuthResponse', response)
    },

    async changePassword(context, payload) {
      gaEvent({
        action: 'change-password',
        event_category: 'engagement',
        event_label: 'User-change-password-click',
      })
      try {
        const user = await currentAuthenticatedUser()
        await changepassword(user, payload.oldPassword, payload.newPassword)
      } catch (err) {
        throw err.message || err
      }
    },

    async forgotPasswordSubmit({ commit }, payload) {
      gaEvent({
        action: 'forgot-password-submit',
        event_category: 'engagement',
        event_label: 'User-forgot-password-submited',
      })
      let response = await forgotPassword(
        payload.username,
        payload.code,
        payload.newPassword,
      )

      commit('setAuthResponse', response)
    },

    async fetchUserDetail({ commit, state }, updateIfExists = true) {
      gaEvent({
        action: 'fetch-user-detail',
        event_category: 'engagement',
        event_label: 'User-fetch-user-detail',
      })
      try {
        if (!updateIfExists) {
          const userID = state.userDetail?.userID
          if (userID) return { userDetail: state.userDetail }
        }
        const authUser = await currentAuthenticatedUser()
        const currentUserInfo = await Auth.currentUserInfo()
        const userDetail = {
          ...authUser.attributes,
          userID: currentUserInfo.id,
          userName: currentUserInfo.username,
        }
        commit('setUserDetail', userDetail)
        return { userDetail }
      } catch (err) {
        if (err?.status !== 404) console.error('fetchUserDetail: ', err)
        return { err }
      }
    },

    async signout({ commit }) {
      gaEvent({
        action: 'sign-out',
        event_category: 'engagement',
        event_label: 'User-signed-out',
      })
      await signout()
      commit('setAuthResponse', {})
    },
  },
}
