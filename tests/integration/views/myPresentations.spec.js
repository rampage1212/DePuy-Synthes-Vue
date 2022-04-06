/*eslint-env node, jest, amd*/
import { setupPage } from './setupViews.js'
import { DEFAULT_DEPARTMENT } from '@/utils/constants.js'
jest.mock('@/api/user.api')
jest.mock('@/api/notification.api')
jest.mock('@/api/rfps.api')
jest.mock('@/api/link.api')

describe('My presentations page', () => {
  /**
   * @type {import('@vue/test-utils').VueWrapper}
   * */
  let wrapper

  /**
   * @type {import('@/router/router').router}
   * */
  // eslint-disable-next-line no-unused-vars
  let router

  beforeAll(async () => {
    const setup = await setupPage(`/${DEFAULT_DEPARTMENT}/my-presentations`)
    wrapper = setup.wrapper
    router = setup.router
  })

  describe('My presentations page display', () => {
    it('should show correct title', async () => {
      const pageWrapperHeader = wrapper.find(
        '[data-test="page-wrapper-header"]',
      )
      expect(pageWrapperHeader.exists()).toBe(true)
      expect(pageWrapperHeader.text()).toBe('My Presentations')
    })

    it('should display correct headerBreadCrumps', () => {
      const breadCrumpsPageName = wrapper.find(
        '[data-test="header-bread-crumps-page-name"]',
      )
      expect(breadCrumpsPageName.exists()).toBe(true)
      expect(breadCrumpsPageName.text()).toBe('My Presentations')
    })

    it('displays table headers', () => {
      const expectedTableHeaders = ['', 'Client', 'Shared With', '']

      const myRfpDrafts = wrapper.find('[data-test="my-rfp-drafts"]')
      const draftTableHeaders = myRfpDrafts.findAll('th')

      const myRfpPublished = wrapper.find('[data-test="my-rfp-published"]')
      const publishedTableHeaders = myRfpPublished.findAll('th')

      ;[draftTableHeaders, publishedTableHeaders].forEach((tableHeaders) => {
        expect(tableHeaders.length).toBe(4)
        tableHeaders.forEach((tableHeader, index) =>
          expect(tableHeader.text()).toMatch(expectedTableHeaders[index]),
        )
      })
    })
  })
})
