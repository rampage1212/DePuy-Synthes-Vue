<template>
  <section class="flex flex-col items-center my-auto w-full min-w-81">
    <header class="font-medium text-4xl">Login to your account</header>

    <form
      class="max-w-md w-full mt-8 mb-4 space-y-8"
      @submit.prevent="signIn()"
    >
      <login-input
        id="email"
        v-model="username"
        type="email"
        label="Email Address"
        placeholder="Your Email / Username"
        icon="email"
      />
      <login-input
        id="password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter Password"
        icon="password"
      />

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            class="h-5 w-5 rounded checked:bg-theme-primary"
            @click="rememberGaLog"
          />
          <label for="remember_me" class="ml-2 text-gray-500">
            Remember me
          </label>
        </div>

        <a href="#" class="font-bold" @click="passForgtGaLog">
          Forgot password?
        </a>
      </div>

      <dp-button
        :text="!signInLoading ? 'Sign In' : 'Signing In ...'"
        :loading="signInLoading"
        :disabled="signInDisabled"
        type="submit"
        class="w-full py-3 uppercase font-semibold text-white bg-secondary disabled:opacity-50"
        :class="
          !isAscLogin
            ? 'bg-gradient-to-r from-primary-grad-from to-primary-grad-to'
            : ''
        "
      />
    </form>

    <router-link
      to="support"
      class="font-semibold text-sm text-gray-500 mx-auto"
    >
      Contact Admin
    </router-link>

    <p class="text-red-500 mt-1 w-full min-h-6">{{ errorMessage }}</p>
  </section>
</template>
<script>
import { computed, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import LoginInput from '@/components/inputs/LoginInput.vue'
import DpButton from '../buttons/DpButton.vue'
import { gaEvent } from '@/utils/GA_Event.js'

export default {
  components: { DpButton, LoginInput },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const username = ref('')
    const password = ref('')
    const signInLoading = ref(false)
    const errorMessage = ref('')

    const isAscLogin = computed(() => route.params.department === 'asc')

    const signInDisabled = computed(() => {
      return (
        !(username.value.length > 0 && password.value.length > 0) ||
        signInLoading.value
      )
    })

    const signIn = async () => {
      try {
        signInLoading.value = true
        errorMessage.value = ''
        await store.dispatch('auth/signIn', {
          username: username.value,
          password: password.value,
        })
        signInLoading.value = false

        const authResponse = await store.getters['auth/authResponse']
        if (authResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
          router.push({
            name: 'newPassword',
          })
        } else {
          await store.dispatch('auth/fetchUserDetail')

          const returnUrl = router.currentRoute.value.query.returnUrl
          router.push(
            returnUrl || {
              name: 'dashboard',
            },
          )
          signedInGaLog()
        }
      } catch (err) {
        console.error('login error: ', err)
        errorMessage.value = err?.message || err
        signInLoading.value = false
        signInErrGaLog()
      }
    }

    const signedInGaLog = () => {
      gaEvent({
        action: 'login-in-success',
        event_category: 'login',
        event_label: 'User-loged-in-successfully',
      })
    }
    const signInErrGaLog = () => {
      gaEvent({
        action: 'login-failed',
        event_category: 'engagement',
        event_label: `User-couldn't-logged-in`,
      })
    }
    const rememberGaLog = () => {
      gaEvent({
        action: 'login-remember-me-checkbox-selected',
        event_category: 'engagement',
        event_label: `User-select-login-remember-me-checkbox`,
      })
    }
    const passForgtGaLog = () => {
      gaEvent({
        action: 'forgot-password',
        event_category: 'engagement',
        event_label: `User-forgot-password`,
      })
    }
    return {
      signInDisabled,
      isAscLogin,
      username,
      password,
      signInLoading,
      errorMessage,
      signIn,
      rememberGaLog,
      passForgtGaLog,
    }
  },
}
</script>
