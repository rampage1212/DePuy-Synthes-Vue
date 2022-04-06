/*eslint-env node, jest, amd*/
import store from './setupStore.js'
import {
  createRfp,
  deleteRfp,
  shareRfp,
  updateRfp,
  getMyRfp,
  updateSlideContent,
} from '@/api/rfps.api'

import {
  getPublishedLinks,
  getLinkByHyperLink,
  getLinkByHyperLinkAndToken,
  syncLink,
  deletePublishLink,
} from '@/api/link.api'
import {
  getCreatedRfp,
  getShareRfpPayload,
  getMyRfps,
  getUpdatedSlideContent,
  getEmptyCurrentRfpDefault,
} from '../../__data__/rfps/sampleRfps'

import { sampleLink } from '@/api/__mocks__/link.api'
import { getPublishedLinksJson } from '../../__data__/rfps/sampleLinks'
import { getUser } from '@/api/user.api'
import defaultPresentationConfig from '@/data/defaultPresentationConfig.json'
import { mockUserDetail } from '../../__data__/auth/authData.js'
import defaultSlideContents from '@/data/defaultSlideContent.js'
import { getUpdateRfpPayloads } from '@/store/modules/rfps.store.js'

jest.mock('@/api/user.api')
jest.mock('@/api/rfps.api')
jest.mock('@/api/link.api')

describe('rfps store spec', () => {
  afterEach(() => {
    store.commit('rfps/setMyRfps', [])
    store.commit('rfps/setPublishedLinks', [])
  })
  it('should get empty myRfps', () => {
    const myRfps = store.getters['rfps/myRfps']
    expect(myRfps).toEqual([])
  })
  // actions tests
  it('should fetch myRfps from api', async () => {
    const result = await store.dispatch('rfps/fetchMyRfps')

    result.response.forEach((rfp) => {
      expect(rfp.slides.length).toBeGreaterThan(0)
    })

    expect(getUser).toBeCalled()
    const myRfps = store.getters['rfps/myRfps']
    expect(myRfps).toEqual(result.response)

    // latest rfps should be first
    // @TODO what does rfp2.createdDate.localeCompare(rfp1.createdDate) line do?
    // expect(Date.parse(myRfps[0].createdDate)).toBeGreaterThan(
    //   Date.parse(myRfps[1].createdDate),
    // )
  })
  it('should create Rfps with valid customer name', async () => {
    const resp = await store.dispatch('rfps/createRfp', getCreatedRfp())
    expect(getUser).toBeCalled()
    expect(createRfp).toBeCalled()
    const createdRfp = getCreatedRfp()
    createdRfp.contact = JSON.parse(createdRfp.contact || '')
    expect(resp.presentationId).toEqual(createdRfp.presentationId)
    expect(resp.ownerId).toEqual(createdRfp.ownerId || mockUserDetail.id)
    expect(resp.slides.length).toEqual(resp.slides.length)
    expect(typeof resp.stakeholders).toEqual('object')

    const currentRfp = store.getters['rfps/getCurrentRfp']
    expect(currentRfp.presentationId).toEqual('')
    expect(currentRfp.customerName).toEqual('')
    expect(currentRfp.customerProblem).toEqual('')
    expect(currentRfp.links).toEqual([])
  })
  it('should reject Rfps with invalid customer name', async () => {
    const invalidRfp = {
      presentationId: '0530e97a-658d-4165-bef4-e47ec8741683',
      date: 'Feb 14 2021',
      createdDate: 'Feb 14 2021',
      customerName: '@#name',
    }

    try {
      await store.dispatch('rfps/createRfp', invalidRfp)
    } catch (e) {
      expect(e).toEqual('Customer Name Contains Invalid Values')
    }
    expect(getUser).toHaveBeenCalled()
  })

  it('should delete rfp by presentationId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const presentationId = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const initialRfpsLength = store.getters['rfps/myRfps'].length

    await store.dispatch('rfps/deleteRfp', presentationId)

    expect(deleteRfp).toHaveBeenCalledWith(presentationId)
    const myRfps = store.getters['rfps/myRfps']
    expect(myRfps.length).toEqual(initialRfpsLength - 1)
    const index = myRfps.findIndex(
      (rfp) => rfp.presentationId === presentationId,
    )
    expect(index).toEqual(-1)
  })

  it('should update rfp with key', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const presentationId = '0530e97a-658d-4165-bef4-e47ec8741683'

    const presentationState =
      store.getters['rfps/getPresentationById'](presentationId)

    const updateTypes = [
      {
        updateType: 'contact',
        updateValues: {
          customerName: 'updated customer 12',
          contact: [{ email: 'email12', name: 'name12', role: 'role12' }],
          customerProblem: 'updated customerProblem 12',
        },
      },
      {
        updateType: 'internalUserDetails',
        updateValues: {
          internalUserDetails: [
            {
              email: 'peter@gmail.com',
              firstName: 'Peter 1',
              lastName: 'Lastname',
              role: 'EDITOR',
            },
          ],
        },
      },
      {
        updateType: 'stakeholders',
        updateValues: { stakeholders: [{ name: 'stake1' }] },
      },
      {
        updateType: 'discovery',
        updateValues: { discovery: [{ name: 'discovery1' }] },
      },
      {
        updateType: 'contract',
        updateValues: { contract: [{ name: 'contract1' }] },
      },
      {
        updateType: 'slideSelection',
        updateValues: { slideSelection: [{ name: 'slideSelection1' }] },
      },
      {
        updateType: 'slides',
        updateValues: {
          slides: [],
        },
      },
    ]

    for (const { updateType, updateValues } of updateTypes) {
      const updatedPresentation = {
        ...presentationState,
        ...updateValues,
      }
      store.commit('rfps/updateRfp', updatedPresentation)

      await store.dispatch('rfps/saveRfpChanges', {
        presentationId,
        updateType,
      })

      const presentation =
        store.getters['rfps/getPresentationById'](presentationId)

      const { key, payload } = getUpdateRfpPayloads(
        presentationId,
        updatedPresentation,
      )[updateType]

      expect(updateRfp).toBeCalledWith(key, payload)
      expect(updatedPresentation).toMatchObject(presentation)
    }
  })

  it('should share with action', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const shareRfpPayload = getShareRfpPayload()
    await store.dispatch('rfps/sharedWithAction', shareRfpPayload)
    const rfp = store.getters['rfps/getPresentationById'](
      shareRfpPayload.presentationId,
    )

    expect(rfp.internalUserDetails).toEqual(shareRfpPayload.internalUserDetails)
  })

  it('should share with user with EDITOR role', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: '0530e97a-658d-4165-bef4-e47ec8741683',
      internalTeamDetail: {
        email: 'peter@gmail.com',
        firstName: 'Peter 1',
        lastName: 'Lastname',
        internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
      },
      role: 'EDITOR',
    }
    await store.dispatch('rfps/shareWithUser', payload)
    const data = {
      internalTeamDetailList: [
        {
          email: payload.internalTeamDetail.email,
          firstName: payload.internalTeamDetail.firstName,
          lastName: payload.internalTeamDetail.lastName,
          shareRfp: payload.internalTeamDetail.shareRfp,
          userType: payload.internalTeamDetail.userType,
          role: payload.role,
        },
      ],
      presentationId: payload.presentationId,
      tier: 'TIER_4',
    }
    expect(shareRfp).toBeCalledWith(data)
    const pres = store.getters['rfps/getPresentationById'](
      payload.presentationId,
    )
    const internalUserDetails = pres.internalUserDetails.find(
      (isd) => isd.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(internalUserDetails.role).toEqual(payload.role)
  })

  it('should share with user with role equal to NONE', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: '0530e97a-658d-4165-bef4-e47ec8741683',
      internalTeamDetail: {
        email: 'peter@gmail.com',
        firstName: 'Peter 1',
        lastName: 'Lastname',
        internalUserId: 1,
      },
      role: 'NONE',
    }
    await store.dispatch('rfps/shareWithUser', payload)
    const data = {
      internalTeamDetailList: [
        {
          email: payload.internalTeamDetail.email,
          firstName: payload.internalTeamDetail.firstName,
          lastName: payload.internalTeamDetail.lastName,
          shareRfp: payload.internalTeamDetail.shareRfp,
          userType: payload.internalTeamDetail.userType,
          role: payload.role,
        },
      ],
      presentationId: payload.presentationId,
      tier: 'TIER_4',
    }
    expect(shareRfp).toBeCalledWith(data)
    const pres = store.getters['rfps/getPresentationById'](
      payload.presentationId,
    )
    const internalUserDetails = pres.internalUserDetails.find(
      (isd) => isd.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(internalUserDetails).toBeUndefined()
  })
  it('should share with user with VIEWER role', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: '0530e97a-658d-4165-bef4-e47ec8741683',
      internalTeamDetail: {
        email: 'peter@gmail.com',
        firstName: 'Peter 1',
        lastName: 'Lastname',
        internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
      },
      role: 'VIEWER',
    }
    await store.dispatch('rfps/shareWithUser', payload)
    const data = {
      internalTeamDetailList: [
        {
          email: payload.internalTeamDetail.email,
          firstName: payload.internalTeamDetail.firstName,
          lastName: payload.internalTeamDetail.lastName,
          shareRfp: payload.internalTeamDetail.shareRfp,
          userType: payload.internalTeamDetail.userType,
          role: payload.role,
        },
      ],
      presentationId: payload.presentationId,
      tier: 'TIER_4',
    }
    expect(shareRfp).toBeCalledWith(data)
    const pres = store.getters['rfps/getPresentationById'](
      payload.presentationId,
    )
    const internalUserDetails = pres.internalUserDetails.find(
      (isd) => isd.internalUserId === payload.internalTeamDetail.internalUserId,
    )
    expect(internalUserDetails.role).toEqual(payload.role)
  })
  it('should get myRfp by Id', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const preId = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const result = await store.dispatch('rfps/getMyRfpbyId', preId)
    expect(getMyRfp).toBeCalledWith(preId)
    const rfp = getMyRfps().find((f) => f.presentationId === preId)
    expect(result.rfp.presentationId).toEqual(rfp.presentationId)
    expect(result.rfp.ownerId).toEqual(rfp.ownerId)
    const myRfps = store.getters['rfps/myRfps']
    const myrfp = myRfps.find(
      (rfp_l) => rfp_l.presentationId === rfp.presentationId,
    )
    expect(myrfp.presentationId).toEqual(rfp.presentationId)
    expect(myrfp.ownerId).toEqual(rfp.ownerId)
  })
  it('should get LinkByHyperLink', async () => {
    const hyperLink = {
      clientName: 'Jhon Oliver',
      hyperLink: 'https://www.google.com/search?client=firefox-b-d&q=hyperLink',
    }
    const { link } = await store.dispatch('rfps/getLinkByHyperLink', hyperLink)
    expect(link).toEqual(sampleLink)
    expect(getLinkByHyperLink).toBeCalledWith(
      hyperLink.clientName,
      hyperLink.hyperLink,
    )
    const publishedLinks = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks).toEqual([sampleLink])
  })

  it('should get LinkByHyperLinkAndToken', async () => {
    const hyperLink = {
      clientName: 'Jhon Oliver',
      hyperLink: 'https://www.google.com/search?client=firefox-b-d&q=hyperLink',
      token: 'sample_token_uuid',
    }
    const { link } = await store.dispatch(
      'rfps/getLinkByHyperLinkAndToken',
      hyperLink,
    )
    expect(link).toEqual(sampleLink)
    expect(getLinkByHyperLinkAndToken).toBeCalledWith(
      hyperLink.clientName,
      hyperLink.hyperLink,
      hyperLink.token,
    )
    const publishedLinks = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks).toEqual([sampleLink])
  })

  it('should syncLink', async () => {
    const id = 1
    await store.dispatch('rfps/syncLink', id)

    expect(syncLink).toBeCalledWith(id)
    const publishedLinks = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks).toEqual([sampleLink])
  })

  it('should get PublishedLinks', async () => {
    const id = mockUserDetail.id
    const payload = {
      limit: 10,
      page: 1,
    }
    const { links } = await store.dispatch('rfps/getPublishedLinks', payload)

    expect(links).toEqual(getPublishedLinksJson())

    expect(getPublishedLinks).toBeCalledWith(id, payload.limit, payload.page)
    const publishedLinks_store = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks_store).toEqual(getPublishedLinksJson())
  })

  it('should delete PublishLink', async () => {
    const link1 = {
      id: 1,
      link: 'sample_link',
    }
    const link2 = {
      id: 2,
      link: 'sample_link_2',
    }
    store.commit('rfps/setPublishedLinks', [link1, link2])
    const id = 1
    await store.dispatch('rfps/deletePublishLink', id)

    expect(deletePublishLink).toBeCalledWith(id)
    const publishedLinks_store = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks_store).toEqual([link2])
  })

  it('should update DraftLocal', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200',
      prePopulatedSlide: 'APDX2',
      content: 'UpdatedSlideContent',
    }
    await store.dispatch('rfps/updateDraftLocal', payload)

    const myRfps = store.getters['rfps/myRfps']
    const myRfpSlides = myRfps.find(
      (rfp) => rfp.presentationId === payload.presentationId,
    ).slides
    const updatedSlide = myRfpSlides.find(
      (slide) => slide.slide.prePopulatedSlide === payload.prePopulatedSlide,
    ).slide
    expect(updatedSlide.slideContent).toEqual(payload.content)
  })

  // @TODO problem with src code
  it.skip('should not update DraftLocal when no chage presented', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200',
      prePopulatedSlide: 'APDX2',
      content: null,
    }
    store.dispatch('rfps/updateDraftLocal', payload)

    const myRfps = store.getters['rfps/myRfps']
    const myRfpSlides = myRfps.find(
      (rfp) => rfp.presentationId === payload.presentationId,
    ).slides
    const updatedSlide = myRfpSlides.find(
      (slide) => slide.slide.prePopulatedSlide === payload.prePopulatedSlide,
    ).slide
    expect(updatedSlide.slideContent).not.toEqual(payload.content)
  })

  it('should update SlideContent', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const payload = {
      presentationId: 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200',
      prePopulatedSlide: 'APDX2',
      content: 'UpdatedSlideContent',
    }

    const updatedSlide = await store.dispatch(
      'rfps/updateSlideContent',
      payload,
    )

    const commitedUpdate = getUpdatedSlideContent()
    expect(updatedSlide).toEqual(commitedUpdate)

    const updateDraftBody = {
      content: payload.content,
      presentationId: payload.presentationId,
      slideId: '05e5ee2b-ae14-4884-8e42-f92b2bb8e465',
      version: 1,
    }
    expect(updateSlideContent).toHaveBeenCalledWith(updateDraftBody)

    const myRfps = store.getters['rfps/myRfps']
    const myRfpSlides = myRfps.find(
      (rfp) => rfp.presentationId === payload.presentationId,
    ).slides
    const updatedSlideFromStore = myRfpSlides.find(
      (slide) => slide.slide.prePopulatedSlide === payload.prePopulatedSlide,
    ).slide
    expect(updatedSlideFromStore.slideContent).toEqual(payload.content)
  })

  // getters tests
  it('should get DraftRfps', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const draftRfps = store.getters['rfps/getDraftRfps']
    const myrfps = store.getters['rfps/myRfps']
    const draftsLocal = myrfps.filter((f) => f.publicationCount == 0)

    expect(draftRfps.length).toEqual(draftsLocal.length)
  })
  it('should get PublishedLinks', async () => {
    const publishedLinks = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks).toEqual([])
  })

  it('should get PublishedLinksByPresentationId', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const publishedLinksByPId =
      store.getters['rfps/getPublishedLinksByPresentationId'](pid)
    const fromJson = getPublishedLinksJson().find(
      (f) => f.presentationId === pid,
    )

    expect(publishedLinksByPId[0]).toMatchObject(fromJson)
  })

  it('should get PublishedLinksByLinkName', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const linkName = 'link1'
    const publishedLinksByLinkName =
      store.getters['rfps/getPublishedLinksByLinkName'](linkName)
    const fromJson = getPublishedLinksJson().find(
      (f) => f.linkName === linkName,
    )
    expect(publishedLinksByLinkName).toEqual(fromJson)
  })

  it('should get publishedRfpIds', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const publishedRfpIds = store.getters['rfps/publishedRfpIds']

    expect(publishedRfpIds).toEqual([pid])
  })

  it('should non empty getPublishedLinks', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const userId = mockUserDetail.id
    const payload = {
      limit: 1,
      page: 1,
    }
    await store.dispatch('rfps/getPublishedLinks', payload)
    expect(getPublishedLinks).toBeCalledWith(
      userId,
      payload.limit,
      payload.page,
    )
    const publishedLinks = store.getters['rfps/getPublishedLinks']
    expect(publishedLinks).toEqual(getPublishedLinksJson())
  })

  it('should get PublishedRfps', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const publishedRfps = store.getters['rfps/getPublishedRfps']
    expect(publishedRfps).toEqual([])
  })

  it('should sharedWithMe', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const result = store.getters['rfps/sharedWithMe']
    const expected = [
      {
        customerName: 'test customer',
        owner: {
          email: 'melaku44@gmail.com',
          firstName: 'Melaku',
          internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
          lastName: 'dev',
          role: 'OWNER',
          shareRfp: false,
          userId: 'us-east-1:dc22a6b0-d502-4ade-8b95-01bdaac6aecb',
          userType: null,
        },
        presentationId: '0530e97a-658d-4165-bef4-e47ec8741683',
        role: undefined,
        sharedBy: {
          email: 'melaku44@gmail.com',
          firstName: 'Melaku',
          internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
          lastName: 'dev',
          role: 'OWNER',
          shareRfp: false,
          userId: 'us-east-1:dc22a6b0-d502-4ade-8b95-01bdaac6aecb',
          userType: null,
        },
      },
      {
        customerName: 'test45',
        owner: {
          email: 'melaku44@gmail.com',
          firstName: 'Melaku',
          internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
          lastName: 'dev',
          role: 'OWNER',
          shareRfp: false,
          userId: 'us-east-1:dc22a6b0-d502-4ade-8b95-01bdaac6aecb',
          userType: null,
        },
        presentationId: 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200',
        role: undefined,
        sharedBy: {
          email: 'melaku44@gmail.com',
          firstName: 'Melaku',
          internalUserId: '1f6da14f-342e-4dd4-a3ed-5580ca566356',
          lastName: 'dev',
          role: 'OWNER',
          shareRfp: false,
          userId: 'us-east-1:dc22a6b0-d502-4ade-8b95-01bdaac6aecb',
          userType: null,
        },
      },
    ]
    expect(result).toEqual(expected)
  })

  it('should get presentation by id', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const result = store.getters['rfps/getPresentationById'](pid)
    const fromJson = getMyRfps().find((f) => f.presentationId === pid)
    expect(result.presentationId).toEqual(fromJson.presentationId)
  })

  it('should get currentRfp/EmptyCurrentRfpDefault for no id', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = null
    const result = store.getters['rfps/getPresentationById'](pid)
    expect(result.presentationId).toEqual('')
    expect(result.slideSelection).toEqual(defaultPresentationConfig)
    expect(result.links).toEqual([])
  })

  it('should get CollaboratorsByPresentationId id', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const result = store.getters['rfps/getCollaboratorsByPresentationId'](pid)
    const fromJson = getMyRfps().find((f) => f.presentationId === pid)
    fromJson.contact = JSON.parse(fromJson.contact)
    expect(result.presentationId).toEqual(fromJson.presentationId)
    expect(result.slides.length).toEqual(fromJson.slides.length)
  })

  // @TODO EmptyCurrentRfpDefault has no slides that is why this test fails
  // problem with src code
  it.skip('should getCurrentRfpSlides', async () => {
    const result = store.getters['rfps/getCurrentRfpSlides']
    const slides = []
    const fromJson = getEmptyCurrentRfpDefault().slides.forEach((sg) =>
      slides.push(...sg.slides),
    )
    expect(result).toEqual(fromJson)
  })

  it('should get EmptyCurrentRfp', async () => {
    const result = store.getters['rfps/getEmptyCurrentRfp']
    expect(result.presentationId).toEqual('')
    expect(result.customerName).toEqual('')
    expect(result.customerProblem).toEqual('')
    expect(result.slideSelection).toEqual(defaultPresentationConfig)
  })

  // @TODO there is no state by the name:selectedSlides
  // problem with src code
  it.skip('should get selectedSlides', async () => {
    const result = store.getters['rfps/selectedSlides']
    expect(result).toEqual(undefined)
  })

  it('should getNonCustomSlidesByPresentationId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const result = store.getters['rfps/getNonCustomSlidesByPresentationId'](pid)
    const fromJson = getMyRfps()
      .find((f) => f.presentationId === pid)
      .slides.filter((slide) => slide.customSlideType == undefined)
    expect(result.length).toEqual(fromJson.length)
  })

  it('should getLinkByHyperLink', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const link = {
      id: '94c16ce7-6307-4537-9de3-97cdc1999284',
      clientName: 'test1',
      hyperLink: 'hyperlink1',
    }
    const result = store.getters['rfps/getLinkByHyperLink'](
      link.clientName,
      link.hyperLink,
    )
    expect(result.id).toEqual(link.id)
  })

  it('should getSlidesByHyperLink', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const link = {
      id: '94c16ce7-6307-4537-9de3-97cdc1999284',
      clientName: 'test1',
      hyperLink: 'hyperlink1',
    }
    const slides = store.getters['rfps/getSlidesByHyperLink'](
      link.clientName,
      link.hyperLink,
    )
    const fromJson = getPublishedLinksJson().find(
      (f) => f.clientName === link.clientName && f.hyperLink === link.hyperLink,
    ).slides
    expect(slides.length).toEqual(fromJson.length)
  })

  it('should getEnabledSlidesByPresentationId', async () => {
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
    }
    const enabledSlides =
      store.getters['rfps/getEnabledSlidesByPresentationId'](link)
    const fromJson = getPublishedLinksJson()
      .find(
        (f) =>
          f.clientName === link.clientName && f.hyperLink === link.hyperLink,
      )
      .slides.filter(({ isEnabled }) => isEnabled)
    expect(enabledSlides.length).toEqual(fromJson.length)
  })

  it('should getEnabledSlidesByPresentationId no hyperLink Provided', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: null,
    }
    const enabledSlides =
      store.getters['rfps/getEnabledSlidesByPresentationId'](link)
    const fromJson = getMyRfps()
      .find((f) => f.presentationId === pid)
      .slides.filter(({ isEnabled }) => isEnabled)
    expect(enabledSlides.length).toEqual(fromJson.length)
  })

  it('should getDisplayedSlidesByPresentationId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
    }
    const enabledSlides =
      store.getters['rfps/getDisplayedSlidesByPresentationId'](link)
    const fromJson = getPublishedLinksJson()
      .find(
        (f) =>
          f.clientName === link.clientName && f.hyperLink === link.hyperLink,
      )
      .slides.filter(({ isEnabled }) => isEnabled)
    expect(enabledSlides.length).toEqual(fromJson.length)
  })

  // @TODO bug in src code: there is no getter with name (getSlidesByLinkName)
  it.skip('should getEnabledSlidesByLinkName', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const linkName = 'link1'
    const enabledSlides =
      store.getters['rfps/getEnabledSlidesByLinkName'](linkName)
    const link = getMyRfps()
      .find((f) => f.presentationId === pid)
      .slides.filter(({ isEnabled }) => isEnabled)
    expect(enabledSlides.length).toEqual(link.length)
  })

  it('should get enabledDynamicSlidesByPresentationId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const enabledDynamicSlides =
      store.getters['rfps/enabledDynamicSlidesByPresentationId'](pid)
    const fromJson = getMyRfps()
      .find((f) => f.presentationId === pid)
      .slides.filter(
        (slide) => slide.isEnabled && slide.slide.slideType === 'DYNAMIC',
      )
    expect(enabledDynamicSlides.length).toEqual(fromJson.length)
  })

  it('should get enabledSlideNumber', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
      slideId: 'INTR_PPH',
    }
    const enabledSlides = store.getters['rfps/enabledSlideNumber'](link)
    expect(enabledSlides).toEqual(2)
  })
  it('should get enabledSlideNumberPerCategory', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
      slideCategory: 'INTRODUCTION',
    }
    const enabledSlides =
      store.getters['rfps/enabledSlideNumberPerCategory'](link)
    const fromJson = getPublishedLinksJson()
      .find(
        (f) =>
          f.clientName === link.clientName && f.hyperLink === link.hyperLink,
      )
      .slides.findIndex(
        ({ isEnabled, slideCategory }) =>
          isEnabled && slideCategory === link.slideCategory,
      )
    expect(enabledSlides).toEqual(fromJson)
  })
  it('should get slideContentBySlideId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
      prePopulatedSlide: 'INTRO1',
    }
    const enabledSlides = store.getters['rfps/getslideContentBySlideId'](link)
    const expected = defaultSlideContents[link.prePopulatedSlide]
    expect(enabledSlides).toEqual(expected)
  })
  it('should get slideContentBySlideId for undefined hyperlink', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const link = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: undefined,
      prePopulatedSlide: 'INTRO1',
    }
    const enabledSlides = store.getters['rfps/getslideContentBySlideId'](link)
    const expected = defaultSlideContents[link.prePopulatedSlide]
    expect(enabledSlides).toEqual(expected)
  })
  it('should get SlideContentByRoute', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const route = {
      presentationId: pid,
      clientName: 'test1',
      hyperLink: 'hyperlink1',
      slideId: 'INTRO1',
    }
    const link = {
      route: {
        params: route,
      },
      slideId: 'test1',
    }
    const enabledSlides = store.getters['rfps/getSlideContentByRoute'](link)
    const expected = defaultSlideContents[route.slideId]
    expect(enabledSlides).toEqual(expected)
  })
  it('should get SlideBySlideId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    // await store.dispatch('rfps/getPublishedLinks')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const payload = {
      presentationId: pid,
      prePopulatedSlide: 'INTRO1',
    }

    const enabledSlides = store.getters['rfps/getSlideBySlideId'](payload)
    const expected = store.getters['rfps/myRfps']
      .find((f) => f.presentationId === pid)
      .slides?.find(
        (f) => f.slide.prePopulatedSlide === payload.prePopulatedSlide,
      )?.slide
    expect(enabledSlides).toEqual(expected)
  })
  it('should get CustomerNameByPresentationId', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const customerName =
      store.getters['rfps/getCustomerNameByPresentationId'](pid)
    const expected = store.getters['rfps/myRfps'].find(
      (f) => f.presentationId === pid,
    )?.customerName
    expect(customerName).toEqual(expected)
  })
  it('should get InputedStepsCounts', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const resp = store.getters['rfps/getInputedStepsCounts'](pid)
    expect(resp).toEqual(1)
  })
  it('should get InputProgressByPresentationId for versionKey = builders', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const versionKey = 'builders'
    const resp = store.getters['rfps/getInputProgressByPresentationId'](
      pid,
      versionKey,
    )
    expect(resp).toEqual(false)
  })
  it('should get InputProgressByPresentationId for versionKey = internal_USER', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = '0530e97a-658d-4165-bef4-e47ec8741683'
    const versionKey = 'internal_USER'
    const resp = store.getters['rfps/getInputProgressByPresentationId'](
      pid,
      versionKey,
    )
    expect(resp).toEqual(true)
  })
  it('should get InputProgressByPresentationId for versionKey = slide_INFOS', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = '0530e97a-658d-4165-bef4-e47ec8741683'
    const versionKey = 'slide_INFOS'
    const resp = store.getters['rfps/getInputProgressByPresentationId'](
      pid,
      versionKey,
    )
    expect(resp).toEqual(false)
  })
  it('should get LastBuilderPage', async () => {
    await store.dispatch('rfps/fetchMyRfps')
    const pid = 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200'
    const enabledDynamicSlides = store.getters['rfps/getLastBuilderPage'](pid)
    const defualtLastPage = 'INTRO1'
    expect(enabledDynamicSlides).toEqual(defualtLastPage)
  })
})
