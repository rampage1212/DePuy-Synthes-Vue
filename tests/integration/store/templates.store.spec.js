/*eslint-env node, jest, amd*/
/*eslint-disable no-import-assign, no-unused-vars*/
import store from './setupStore.js'

import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  getTemplate,
  shareTemplate,
  deleteTemplate,
} from '@/api/templates.api'
import { getUser } from '@/api/user.api'
import overviewSlides from '@/data/allSlides'
import {
  getTemplates,
  getOneTemplate,
  getCreateTemplate,
  getSaveAsTemplate,
  getShareTemplate,
  getUpdatedTemplate,
} from '../../__data__/templates/sampleTemplateData'
import allSlides from '@/data/allSlides'
import { mockUserDetail } from '../../__data__/auth/authData.js'

jest.mock('@/api/user.api')
jest.mock('@/api/templates.api')

describe('templates store module spec', () => {
  afterEach(() => {
    store.commit('templates/setTemplates', [])
    store.commit('templates/setMyTemplates', [])
    store.commit('templates/editTemplates', {})
  })

  it('should get empty templates', () => {
    const templates = store.getters['templates/templates']
    expect(templates).toEqual([])
  })

  it('should get new template slides', () => {
    const slides = store.getters['templates/getNewTemplateSlides']
    expect(slides).toEqual(overviewSlides)
  })

  it('should get empty my templates', () => {
    const myTemplates = store.getters['templates/myTemplates']
    expect(myTemplates).toEqual([])
  })

  it('should get empty all templates', () => {
    const allTemplates = store.getters['templates/allTemplates']
    expect(allTemplates).toEqual([])
  })
  // @TODO src code has bug: setInitialSlide mutation should use filter not map
  it('should set initialSlide', () => {
    store.dispatch('templates/initialSlide')
    const slides = store.getters['templates/getNewTemplateSlides']

    expect(slides).toEqual(allSlides)
  })

  it('should saveTemplate', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templatesBeforeSave = store.getters['templates/templates']
    const count = getTemplates().length - 1
    expect(templatesBeforeSave.length).toEqual(count)
    const payload = {
      templateId: '2539cef5-542e-4922-a1d1-e58c4841cc54',
      templateName: 'asasasasd',
      templateDescription: 'asasdasdasdasda',
      updatedOn: '2021-07-26',
      ownerId: '26bf9c9c-2f5d-4ca7-b65f-e39354715e4d',
      slides: [
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 1,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
          },
        },
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 2,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
          },
        },
      ],
      bookmarked: false,
    }

    const myTemplatesBeforeSave = store.getters['templates/templates'].length
    await store.dispatch('templates/saveTemplate', payload)
    const templatesAfterSave = store.getters['templates/templates']
    expect(templatesAfterSave.length).toEqual(myTemplatesBeforeSave + 1)
    const savedTemplate = templatesAfterSave.find(
      (f) => f.templateId === payload.templateId,
    )
    expect(savedTemplate).toEqual(payload)
  })

  // @TODO bug at the src code: template.store.js line 101 ( save mutation should not access array by templateID)
  it.skip('should save number of slides', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templatesBeforeSave = store.getters['templates/templates']
    const payload = {
      templateID: '95ca3004-05e1-47a7-9623-cc72e496403c',
      numberOfSlides: 3,
    }
    const templateBS = templatesBeforeSave.find(
      (f) => f.templateId === payload.templateID,
    )
    expect(templateBS.numberOfSlides).toEqual(0)
    store.dispatch('templates/save', payload)
    const templatesAfterSave = store.getters['templates/templates']
    const templateAs = templatesAfterSave.find(
      (f) => f.templateId === payload.templateID,
    )
    expect(templateAs.numberOfSlides).toEqual(payload.numberOfSlides)
  })

  it('should sharedWithAction', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const payload = getShareTemplate()
    payload.templateId = templateId
    await store.dispatch('templates/sharedWithAction', payload)
    expect(shareTemplate).toBeCalledWith(payload)
    const myTemplates = store.getters['templates/myTemplates']
    const received = myTemplates.find((f) => f.templateId === templateId)
    expect(received.internalUserDetails).toEqual(payload.internalUserDetails)
  })

  it('should shareWithUser with "EDITOR" role', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const payload = {
      templateId: templateId,
      role: 'EDITOR',
      internalTeamDetail: {
        internalUserId: 'internalUserId',
      },
    }
    await store.dispatch('templates/shareWithUser', payload)
    const args = {
      internalTeamDetailList: [
        { ...payload.internalTeamDetail, role: payload.role },
      ],
      templateId: payload.templateId,
    }
    expect(shareTemplate).toBeCalledWith(args)
    const myTemplates = store.getters['templates/myTemplates']
    const received = myTemplates.find((f) => f.templateId === templateId)
    const shareWith = received.internalUserDetails.find(
      (f) => f.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(shareWith.role).toEqual(payload.role)
  })

  it('should shareWithUser with "NONE" role', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const payload = {
      templateId: templateId,
      role: 'NONE',
      internalTeamDetail: {
        internalUserId: 'internalUserId',
      },
    }
    await store.dispatch('templates/shareWithUser', payload)
    const args = {
      internalTeamDetailList: [
        { ...payload.internalTeamDetail, role: payload.role },
      ],
      templateId: payload.templateId,
    }
    expect(shareTemplate).toBeCalledWith(args)
    const myTemplates = store.getters['templates/myTemplates']
    const received = myTemplates.find((f) => f.templateId === templateId)
    const shareWith = received.internalUserDetails.find(
      (f) => f.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(shareWith).toEqual(undefined)
  })

  it('should roleUpdate with "EDITOR" role', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const payload = {
      templateId: templateId,
      role: 'EDITOR',
      internalTeamDetail: {
        internalUserId: 'internalUserId',
      },
    }
    await store.commit('templates/roleUpdate', payload)
    const myTemplates = store.getters['templates/myTemplates']
    const received = myTemplates.find((f) => f.templateId === templateId)
    const shareWith = received.internalUserDetails.find(
      (f) => f.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(shareWith.role).toEqual(payload.role)
  })

  it('should fetch templates', async () => {
    await store.dispatch('templates/fetchTemplates')
    const myTemplates = store.getters['templates/myTemplates']
    const ownerId = mockUserDetail.id
    const expectedMy = getTemplates()
      .filter((temp) => temp.ownerId === ownerId)
      .map((temp) => ({
        ...temp,
        numberOfSlides: temp.slides.filter((slide) => slide.isEnabled).length,
      }))
    expect(myTemplates).toEqual(expectedMy)

    const templates = store.getters['templates/templates']
    const expected = getTemplates()
      .filter((temp) => temp.ownerId !== ownerId)
      .map((temp) => ({
        ...temp,
        numberOfSlides: temp.slides.filter((slide) => slide.isEnabled).length,
      }))
    expect(templates).toEqual(expected)
  })

  it('should getTemplate', async () => {
    const templateId = '22223333-5717-4562-b3fc-111111111111'
    await store.dispatch('templates/getTemplate', templateId)
    expect(getTemplate).toBeCalledWith(templateId)
    const editTemplate =
      store.getters['templates/getEditTemplatesById'](templateId)
    const expected = getOneTemplate()
    expected.groupedSlides = { Category1: expected.slides }
    expect(editTemplate).toEqual(expected)
    const recievedTemplate =
      store.getters['templates/getTemplateByID'](templateId)

    expect(recievedTemplate).toEqual(getOneTemplate())
  })

  it('should createTemplate', async () => {
    const templateToBeCreated = {
      templateId: '2539cef5-542e-4922-a1d1-e58c4841cc54',
      templateName: 'asasasasd',
      templateDescription: 'asasdasdasdasda',
      updatedOn: '2021-07-26',
      ownerId: '26bf9c9c-2f5d-4ca7-b65f-e39354715e4d',
      slides: [
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 1,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
            prePopulatedSlide: 'APPD1',
          },
        },
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 2,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
            prePopulatedSlide: 'APPD2',
          },
        },
      ],
      bookmarked: false,
    }
    await store.dispatch('templates/createTemplate', templateToBeCreated)
    const args = {
      ownerId: mockUserDetail.id,
      slideInfos: [
        {
          isEnabled: false,
          pageNumber: 1,
          slideCategory: 'INTRODUCTION',
          slideCode: 'APPD1',
        },
        {
          isEnabled: false,
          pageNumber: 2,
          slideCategory: 'INTRODUCTION',
          slideCode: 'APPD2',
        },
      ],
      templateName: 'asasasasd',
      templateDescription: 'asasdasdasdasda',
    }
    expect(createTemplate).toBeCalledWith(args)
    const templates = store.getters['templates/myTemplates']
    expect(templates.length).toEqual(1)
    expect(templates[0]).toMatchObject({ ...getCreateTemplate(), ...args })
  })

  it('should delTemplate', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateToBeDeleted = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const templates = store.getters['templates/allTemplates']
    expect(templates.length).toEqual(2)
    const beforeDeleted = templates.find(
      (f) => f.templateId === templateToBeDeleted,
    )
    expect(beforeDeleted).toBeDefined()

    await store.dispatch('templates/delTemplate', templateToBeDeleted)
    expect(deleteTemplate).toBeCalledWith(templateToBeDeleted)
    const templates_after_delete = store.getters['templates/allTemplates']
    expect(templates_after_delete.length).toEqual(1)
    const deleted = templates_after_delete.find(
      (f) => f.templateId === templateToBeDeleted,
    )
    expect(deleted).toEqual(undefined)
  })

  it('should updateTemplate', async () => {
    const templateToBeUpdated = {
      templateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      templateName: 'asasasasd',
      templateDescription: 'asasdasdasdasda',
      updatedOn: '2021-07-26',
      ownerId: '26bf9c9c-2f5d-4ca7-b65f-e39354715e4d',
      slides: [
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 1,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
            prePopulatedSlide: 'APPD1',
          },
        },
        {
          isEnabled: false,
          slideCategory: 'INTRODUCTION',
          pageNumber: 2,
          slideInfoId: 'test1',
          slide: {
            slideType: 'DYNAMIC',
            slideContent: '',
            prePopulatedSlide: 'APPD2',
          },
        },
      ],
      bookmarked: false,
    }
    await store.dispatch('templates/updateTemplate', templateToBeUpdated)
    const args = {
      bookmarked: templateToBeUpdated.bookmarked,
      templateId: templateToBeUpdated.templateId,
      slideInfos: templateToBeUpdated.slides,
      templateName: templateToBeUpdated.templateName,
      templateDescription: templateToBeUpdated.templateDescription,
    }
    expect(updateTemplate).toBeCalledWith(args)

    const editTemplate = store.getters['templates/getEditTemplatesById'](
      templateToBeUpdated.templateId,
    )
    const expected = getUpdatedTemplate()
    expected.groupedSlides = { Category1: expected.slides }
    expect(editTemplate).toEqual(expected)
    const recievedTemplate = store.getters['templates/getTemplateByID'](
      templateToBeUpdated.templateId,
    )

    expect(recievedTemplate).toEqual(getUpdatedTemplate())
  })

  it('should changeBookmarkState', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const templates_before = store.getters['templates/allTemplates']
    const template = templates_before.find((f) => f.templateId === templateId)
    expect(template.bookmarked).toEqual(true)
    await store.dispatch('templates/changeBookmarkState', templateId)
    const templates_after = store.getters['templates/allTemplates']
    const template_after = templates_after.find(
      (f) => f.templateId === templateId,
    )
    expect(template_after.bookmarked).toEqual(false)
  })

  it('should getTemplateByID', async () => {
    await store.dispatch('templates/fetchTemplates')
    const templateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    const templatebyID = store.getters['templates/getTemplateByID'](templateId)
    const expected = getTemplates().find((f) => (f.templateId = templateId))
    expected.numberOfSlides = 2
    expect(templatebyID).toEqual(expected)
  })
})
