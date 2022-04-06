<template>
  <div class="flex flex-col mt-1 bg-white border-2 rounded-xl">
    <router-link
      class="px-5 text-center border-b py-3 hover:bg-gray-75"
      to="/settings/profile"
    >
      Profile
    </router-link>
    <button
      class="px-5 text-center border-t border-b py-3 hover:bg-gray-75"
      @click="logout"
    >
      Log out
    </button>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const logout = async () => {
      await store.dispatch('auth/signout')
      router.replace({
        name: 'login',
        query: { returnUrl: router.currentRoute.value.path },
      })
      window.location.reload() // to clear all vuex state
    }

    return { logout }
  },
}
</script>
