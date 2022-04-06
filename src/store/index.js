import { createStore } from 'vuex'
// import { createLogger } from 'vuex'
import modules from './modules'

const store = createStore({
  strict: import.meta.env.DEV,
  state: {
    name: 'Vue',
  },
  modules,
  // plugins: import.meta.env.DEV ? [createLogger()] : [],
})

export default store
