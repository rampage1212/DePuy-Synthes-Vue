import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import router from './router/router'
import AppLayout from '@/layouts/AppLayout.vue'
import AppLayoutMain from '@/layouts/AppLayoutMain.vue'
import AppLayoutDefault from '@/layouts/AppLayoutDefault.vue'
import SvgIcon from '@/components/utils/SvgIcon.vue'
import 'vite-plugin-svg-icons/register'
import VueGtag from 'vue-gtag-next'

const GA_ID = 'G-7WLVQ1PEMZ' // test google analytics 4 id, will be updated

import './index.css'

createApp(App)
  .use(router)
  .use(store)
  .use(VueGtag, {
    property: {
      id: GA_ID,
    },
  })
  .component('AppLayout', AppLayout)
  .component('layout-main', AppLayoutMain)
  .component('SvgIcon', SvgIcon)
  .component('layout-default', AppLayoutDefault)
  .mount('#app')
