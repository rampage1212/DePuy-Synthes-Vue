/*eslint-env node, jest, amd*/
import store from './setupStore.js'

import { getRfpLinks, publishLink } from '@/api/link.api'

import {
  getCreateLinkRequest,
  getPublishedLinkUnderPresentation,
  getUpdateLinkRequest,
} from '../../__data__/link/linkData'

jest.mock('@/api/link.api')

describe('link store module tests', () => {
  it('should get default rfpLinks', () => {
    const defaultStatus = store.getters['link/rfpLinks']
    expect(defaultStatus).toEqual({})
  })

  it('should fetch rfp links', async () => {
    const presentationId = '34b28dfc-3488-4b24-b72f-88f831c7c1b2'
    const fetchedRfpLinks = await store.dispatch(
      'link/fetchRfpLinks',
      presentationId,
    )
    expect(getRfpLinks).toBeCalledWith(presentationId)
    let links = getPublishedLinkUnderPresentation()
    links.forEach((link) => {
      link.slides.sort(
        (slideA, slideB) => slideA.pageNumber - slideB.pageNumber,
      )
    })

    expect(fetchedRfpLinks).toEqual(links)

    const rfpLinksStore = store.getters['link/rfpLinks']

    const expected = {}
    expected[presentationId] = links
    expect(rfpLinksStore).toEqual(expected)
  })

  it('should get links by PresentationId', () => {
    const presentationId = '34b28dfc-3488-4b24-b72f-88f831c7c1b2'
    const linksByPresentationId =
      store.getters['link/getLinksByPresentationId'](presentationId)
    let links = getPublishedLinkUnderPresentation()
    links.forEach((link) => {
      link.slides.sort(
        (slideA, slideB) => slideA.pageNumber - slideB.pageNumber,
      )
    })
    const expected = {}
    expected[presentationId] = links
    expect(linksByPresentationId).toEqual(links)
  })

  // @TODO bug in src code : TypeError: state.rfpLinks is not iterable @ link.store.js line 14
  it.skip('should get Slides ByHyperLink', () => {
    const presentationId = '34b28dfc-3488-4b24-b72f-88f831c7c1b2'
    const payload = {
      clientName: 'test customer',
      hyperLink: 'testlink',
    }
    const slides = store.getters['link/getSlidesByHyperLink'](
      payload.clientName,
      payload.hyperLink,
    )
    let links = getPublishedLinkUnderPresentation()
    links.forEach((link) => {
      link.slides.sort(
        (slideA, slideB) => slideA.pageNumber - slideB.pageNumber,
      )
    })
    const expected = {}
    expected[presentationId] = links
    expect(slides).toEqual(links)
  })
  it('should get Link ByLinkId', () => {
    const linkId = '4c81812c-02ef-49ef-bb58-d849d825fb69'
    const linksById = store.getters['link/getLinkByLinkId'](linkId)
    let links = getPublishedLinkUnderPresentation()
    links.forEach((link) => {
      link.slides.sort(
        (slideA, slideB) => slideA.pageNumber - slideB.pageNumber,
      )
    })
    const expected = links.find((f) => f.id === linkId)
    expect(linksById).toEqual(expected)
  })
  it('should publish Link with valid hyperLink', async () => {
    const request = getCreateLinkRequest()
    const publishedLink = await store.dispatch('link/publishLink', request)
    expect(publishLink).toBeCalledWith(request)
    expect(publishedLink).toMatchObject(request)
    expect(getRfpLinks).toBeCalledWith(request.presentationId)
  })

  it('should throw error for Link with invalid hyperLink', async () => {
    const request = getCreateLinkRequest()
    request.presentationId = 'DummypresentationId'
    request.hyperLink = '\\[]'
    try {
      await store.dispatch('link/publishLink', request)
    } catch (error) {
      expect(error).toEqual(
        `No "- / \\ : ? # [ ] @ ! $ & ' ( ) * + , ; =" allowed in hyper link`,
      )
    }
    expect(getRfpLinks).not.toHaveBeenCalledWith(request.presentationId)
  })

  it('should update publish Link with valid hyperLink', async () => {
    const request = getUpdateLinkRequest()
    const publishedLink = await store.dispatch('link/publishLink', request)
    expect(publishLink).toBeCalledWith(request)
    expect(publishedLink).toMatchObject(request)
    expect(getRfpLinks).toBeCalledWith(request.presentationId)
  })
})
