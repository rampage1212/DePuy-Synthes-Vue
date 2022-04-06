/*eslint-env node, jest, amd*/
import store from './setupStore.js'

import {
  createSlide,
  deleteCustomSlide,
  fetchCustomSlidesByOwnerId,
  updateCustomSlide,
} from '@/api/custom-slide.api'
import {
  getCreatedSlide,
  getCustomSlidesByOwnerId,
  emptyCustomeSlide,
} from '../../__data__/customSlide/customSlideData'
import { insertCustomSlide } from '@/api/rfps.api'
import { mockUserDetail } from '../../__data__/auth/authData.js'

jest.mock('@/api/user.api')
jest.mock('@/api/custom-slide.api')
jest.mock('@/api/rfps.api')

const mockSlideInfoId2 = getCustomSlidesByOwnerId()[0].slideInfoId

describe('cutsom slide store module spec', () => {
  afterEach(() => {
    store.commit('customSlide/setCustomSlides', [])
    store.commit('customSlide/resetCustomSlideToCreate')
  })
  describe('initial setup', () => {
    it('should get empty all custom slides', () => {
      const received = store.getters['customSlide/allCustomSlides']
      expect(received).toEqual([])
    })
    it('should get customSlideToCreate', () => {
      const slide = store.getters['customSlide/customSlideToCreate']
      expect(slide).toEqual(emptyCustomeSlide())
    })
    it('should get defualt customSlide to create', () => {
      const slide = store.getters['customSlide/customSlide'](null)
      expect(slide).toEqual(emptyCustomeSlide())
    })
  })
  it('should get positionedSlidesList', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    const slideInfoId = mockSlideInfoId2
    const customSlide = getCustomSlidesByOwnerId().find(
      (f) => f.slideInfoId === slideInfoId,
    )
    customSlide.slide.slideContent =
      typeof customSlide.slide.slideContent === 'string'
        ? JSON.parse(customSlide.slide.slideContent)
        : customSlide.slide.slideContent

    const positionedSlidesList = store.getters[
      'customSlide/positionedSlidesList'
    ]({ slideInfoId: slideInfoId, presentationSlides: undefined })
    const customSlideInTheList = positionedSlidesList.find(
      (f) => f.slideInfoId === slideInfoId,
    )
    expect(customSlideInTheList).toBeDefined()
    expect(customSlideInTheList).toEqual(customSlide)
  })

  it('should get positionedSlidesList with empty presentationSlides', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    const slideInfoId = mockSlideInfoId2
    const positionedSlidesList = store.getters[
      'customSlide/positionedSlidesList'
    ]({ slideInfoId: slideInfoId, presentationSlides: [] })

    const mockSlides = getCustomSlidesByOwnerId().find(
      (slide) => slide.slideInfoId === slideInfoId,
    )
    const customSlide = mockSlides

    customSlide.slide.slideContent =
      typeof customSlide.slide.slideContent === 'string'
        ? JSON.parse(customSlide.slide.slideContent)
        : customSlide.slide.slideContent

    expect(positionedSlidesList).toEqual([mockSlides])
  })

  it('should fetchCustomSlidesByOwnerId', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    expect(fetchCustomSlidesByOwnerId).toBeCalledWith(mockUserDetail.id)

    const customSlidesInStore = store.getters['customSlide/allCustomSlides']
    const expectedCustomSlides = getCustomSlidesByOwnerId().map((slide) => ({
      ...slide,
      slide: {
        ...slide.slide,
        slideContent: JSON.parse(slide.slide.slideContent),
      },
    }))

    expect(customSlidesInStore.length).toBeGreaterThan(1) // at least two are fetched
    expect(customSlidesInStore).toEqual(expectedCustomSlides)
  })

  it('should createCustomSlide', async () => {
    const customSlideFullData = store.getters['customSlide/customSlide']()

    const slideToCreate = {
      ...customSlideFullData,
      ownerId: mockUserDetail.id,
      customSlideType: customSlideFullData.slide.customSlideType,
      pageNumber: 3,
      slideCategory: customSlideFullData.slideCategory,
      slide: {
        ...customSlideFullData.slide,
        slideContent: {
          ...customSlideFullData.slide.slideContent,
          slideTitle: 'new slide 2',
        },
      },
    }

    store.commit('customSlide/setCustomSlide', slideToCreate)

    await store.dispatch('customSlide/createCustomSlide')

    expect(createSlide).toBeCalledWith({
      ownerId: slideToCreate.ownerId,
      customSlideType: slideToCreate.customSlideType,
      pageNumber: slideToCreate.pageNumber,
      slideCategory: slideToCreate.slideCategory,
      slideData: JSON.stringify(slideToCreate.slide.slideContent),
    })
    expect(updateCustomSlide).toBeCalled()

    const createdSlideInStore = store.getters['customSlide/customSlide'](
      getCreatedSlide().slideInfoId,
    )
    expect(createdSlideInStore).toBeDefined()

    expect(createdSlideInStore).toMatchObject({
      pageNumber: slideToCreate.pageNumber,
      slideCategory: slideToCreate.slideCategory,
      createdDate: getCreatedSlide().createdDate,
      slideInfoId: getCreatedSlide().slideInfoId,
      slide: {
        customSlideType: slideToCreate.slide.customSlideType,
        slideContent: {
          ...slideToCreate.slide.slideContent,
          initialSlideInfoId: getCreatedSlide().slideInfoId,
        },
        slideInfoId: getCreatedSlide().slideInfoId,
      },
    })
  })

  it('should updateCustomSlide', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    const uneditedSlide =
      store.getters['customSlide/customSlide'](mockSlideInfoId2)

    uneditedSlide.slide.slideContent.slideTitle = 'edited title'

    await store.dispatch('customSlide/updateCustomSlide', uneditedSlide)
    const updatedSlideInStore = store.getters['customSlide/customSlide'](
      uneditedSlide.slideInfoId,
    )
    const updatedSlideBody = {
      pageNumber: uneditedSlide.pageNumber,
      slideCategory: uneditedSlide.slideCategory,
      slideInfoId: uneditedSlide.slideInfoId,
      slideData: JSON.stringify({
        initialSlideInfoId: uneditedSlide.slideInfoId,
        ...uneditedSlide.slide.slideContent,
      }),
    }

    expect(updateCustomSlide).toBeCalledWith(updatedSlideBody)
    expect(updatedSlideInStore.slide.slideContent.slideTitle).toEqual(
      uneditedSlide.slide.slideContent.slideTitle,
    )
  })

  it('should insertCustomSlide default customSlideToCreate', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    const rfps = (await store.dispatch('rfps/fetchMyRfps')).response
    const { presentationId } = rfps[1]
    const insertedSlide =
      store.getters['customSlide/customSlide'](mockSlideInfoId2)

    let presentation = store.getters['rfps/getPresentationById'](presentationId)
    expect(
      presentation.slides.find(
        ({ slideInfoId }) => slideInfoId === insertedSlide.slide.slideInfoId,
      ),
    ).toBeUndefined()

    await store.dispatch('customSlide/insertCustomSlide', {
      slideInfoId: mockSlideInfoId2,
      presentationId,
    })

    const insertCustomSlidePayload = {
      customSlideId: insertedSlide.slide.slideId,
      pageNumber: insertedSlide.pageNumber,
      slideCategory: insertedSlide.slideCategory,
      presentationId,
    }
    expect(insertCustomSlide).toBeCalledWith(insertCustomSlidePayload)

    presentation = store.getters['rfps/getPresentationById'](presentationId)
    expect(
      presentation.slides.find(
        ({ slideInfoId }) => slideInfoId === insertedSlide.slide.slideInfoId,
      ),
    ).toBeDefined()
  })

  it('should deleteCustomSlide', async () => {
    await store.dispatch('customSlide/fetchCustomSlidesByOwnerId')
    const allCustomSlides = store.getters['customSlide/allCustomSlides']
    const allCustomSlidesSize = allCustomSlides.length

    const customSlideId = mockSlideInfoId2
    await store.dispatch('customSlide/deleteCustomSlide', customSlideId)
    expect(deleteCustomSlide).toBeCalledWith(customSlideId)
    const allCustomSlidesAfterDelete =
      store.getters['customSlide/allCustomSlides'].length

    expect(allCustomSlidesAfterDelete).toEqual(allCustomSlidesSize - 1)
  })

  it('should updateCustomSlidePosition', () => {
    const sampleSlideJson = {
      slideInfoId: '22334455-6677-8899-aabb-f7d440704844',
      slideCategory: 'INTRODUCTION',
      pageNumber: 3,
      slide: {
        slideId: 'ccddffgg-6677-8899-aabb-f7d440704844',
        slideContent:
          '{"initialSlideInfoId":"090bc601-e11f-4617-a76f-f7d440704844","slideTitle":"tes12","subTitle":"","slideCategory":"INTRODUCTION","pageNumber":1,"customSlideType":"CUSTOM_SLIDE_1","version":0,"showTitle":true,"showSubtitle":true,"showImages":true,"numberOfImages":1,"slideInfoId":"090bc601-e11f-4617-a76f-f7d440704844"}',
        version: 0,
        prePopulatedSlide: '',
        slideType: 'CUSTOM',
        customSlideType: 'CUSTOM_SLIDE_1',
      },
      isEnabled: null,
      createdDate: '2021-12-23T22:49:21.144',
    }
    const slides = [sampleSlideJson, ...getCustomSlidesByOwnerId()]

    const payload = {
      slideCategory: 'INTRODUCTION',
      slides,
      pageNumber: 5,
      slideInfoId: null,
      action: 'added',
    }
    store.dispatch('customSlide/updateCustomSlidePosition', payload)

    const customSlideToCreate = store.getters['customSlide/customSlideToCreate']
    const clonedNewCustomSlide = JSON.parse(
      JSON.stringify({
        slideInfoId: payload.slideInfoId,
        slideCategory: payload.slideCategory,
        pageNumber: 5,
      }),
    )
    const expected = { ...emptyCustomeSlide(), ...clonedNewCustomSlide }
    expect(customSlideToCreate).toEqual(expected)
  })
})
