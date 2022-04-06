import { Auth } from '@/api/httpClient.js'
import store from '@/store'
import routes from './routes.js'
import { DEFAULT_DEPARTMENT } from '@/utils/constants.js'
import { createWebHistory, createRouter } from 'vue-router'
import { trackRouter } from 'vue-gtag-next'

async function canUserAccess(to) {
  if (to.meta.isPublic) return true
  try {
    const resp = await Auth.currentAuthenticatedUser()
    if (resp) return true
  } catch (error) {
    return false
  }

  return false
}

async function goToLoginIfNeeded(to, from, router) {
  if (to.fullPath === from.fullPath) return

  const canAccess = await canUserAccess(to)

  if (!canAccess) {
    to.name = to.params.department ? 'login' : 'defaultLogin'
    to.query = { returnUrl: to.path }
    router.push(to)
  }
}

function addDepartmentParam(to, from, router) {
  if (
    !to.params.department &&
    !(to.name === 'login' || to.name === 'defaultLogin')
  ) {
    const userDetail = store.getters['auth/userDetail']

    const currentDepartment =
      from.params.department || userDetail?.department || DEFAULT_DEPARTMENT
    to.params.department = currentDepartment

    router.push(to)
  }
}

function setPageTitle(to) {
  const { title: viewTitle } = to.meta

  let fullTitle
  if (viewTitle) {
    fullTitle = typeof viewTitle === 'function' ? viewTitle(to) : viewTitle
  }

  document.title = fullTitle ? `Gladiator | ${fullTitle}` : 'Gladiator'
}

export function setupRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  trackRouter(router)

  router.beforeEach(async (to, from) => {
    const isInitialLoad = from.fullPath === '/' && to.fullPath === '/dashboard'

    if (isInitialLoad) await goToLoginIfNeeded(to, from, router)

    addDepartmentParam(to, from, router)
  })

  router.afterEach(async (to, from) => {
    setPageTitle(to)

    await goToLoginIfNeeded(to, from, router)
  })

  return router
}

export const router = setupRouter()
export default router
