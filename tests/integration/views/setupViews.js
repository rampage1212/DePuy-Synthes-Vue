/*eslint-env node, jest, amd*/
/*eslint-disable no-import-assign, no-unused-vars*/
import { flushPromises, mount } from '@vue/test-utils'
import AppVue from '@/App.vue'
import SvgIcon from '@/components/utils/SvgIcon.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AppLayoutMain from '@/layouts/AppLayoutMain.vue'
import AppLayoutDefault from '@/layouts/AppLayoutDefault.vue'

import store from '@/store'
import { setupRouter } from '@/router/router.js'

// don't delete this it's used to mock dependencies
import * as gTag from '../../__mocks__/vue-gtag-next.mock.js'
import { Auth } from '../../__mocks__/auth_aws-amplify_mock.js'

document.body.innerHTML = `
  <div>
    <div id="app"></div>
  </div>
`

/**
 * @param  { Boolean } attachToApp - for components with form submitions, attach component to dom element
 */
export default function setupViews(router, attachToApp = false) {
  const wrapper = mount(AppVue, {
    global: {
      plugins: [router, store],
      components: {
        SvgIcon,
        AppLayout,
        'layout-main': AppLayoutMain,
        'layout-default': AppLayoutDefault,
      },
    },
    attachTo: attachToApp ? document.getElementById('app') : undefined,
  })

  return { wrapper, store, router }
}

export async function setupPage(url, attachToApp = false) {
  const router = setupRouter()
  const { wrapper, store } = setupViews(router, attachToApp)
  await router.push(url)
  await router.isReady()
  await flushPromises()
  return { wrapper, store, router }
}
