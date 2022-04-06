import { slideDetails } from '@/data/allSlides.js'

import {
  getMyrfps,
  getMyRfp,
  createRfp,
  updateRfp,
  shareRfp,
  updateSlideContent,
  deleteRfp,
} from '@/api/rfps.api.js'
import {
  getPublishedLinks,
  deletePublishLink,
  getLinkByHyperLink,
  syncLink,
  getLinkByHyperLinkAndToken,
} from '@/api/link.api.js'
import defaultPresentationConfig from '@/data/defaultPresentationConfig.json'
import defaultSlideContents from '@/data/defaultSlideContent.js'
import { gaEvent } from '@/utils/GA_Event.js'
import { cloneDeep } from 'lodash'

const SAMPLE_CONTACTS = [
  {
    name: '',
    role: '',
    email: '',
  },
  {
    name: '',
    role: '',
    email: '',
  },
  {
    name: '',
    role: '',
    email: '',
  },
]

const todaysDate = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
}).format(new Date())

const emptyCurrentRfpDefault = () => ({
  presentationId: '',
  date: todaysDate,
  customerName: '',
  contact: SAMPLE_CONTACTS,
  customerProblem: '',
  stakeholders: null,
  discoveries: null,
  contract: {
    gpoAffilation: '',
    numberAndName: '',
    endDate: '',
    notes: '',
    priceAvailable: null,
  },
  slideSelection: defaultPresentationConfig,
  links: [],
})

function processedPresentationField(presentation, fieldName) {
  const fieldItem = presentation[fieldName]
  return typeof fieldItem === 'string' && fieldItem
    ? JSON.parse(fieldItem)
    : fieldItem || undefined
}

function processedPresentation(presentation, state) {
  presentation = { ...presentation }
  for (const key in presentation)
    if (presentation[key] === null || presentation[key] === undefined)
      delete presentation[key]

  const slidesWithDetails = presentation.slides
    ?.map((slide) => ({
      ...slideDetails(slide.slide),
      ...slide,
    }))
    .sort((slideA, slideB) => slideA.slideNumber - slideB.slideNumber)
    .sort((slideA, slideB) => slideA.pageNumber - slideB.pageNumber)

  const stateRfp =
    state?.myRfps.find(
      ({ presentationId }) => presentationId === presentation.presentationId,
    ) || {}

  const processedRfp = {
    ...emptyCurrentRfpDefault(),
    ...stateRfp,
    ...presentation,
    slides: slidesWithDetails,
  }

  ;[
    'slideSelection',
    'contact',
    'discovery',
    'stakeholders',
    'contract',
  ].forEach((key) => {
    processedRfp[key] = processedPresentationField(processedRfp, key)
  })

  return processedRfp
}

function saveUserIds(internalUserDetails, internalUserDetailsWithIds) {
  const existingUserIds = () =>
    internalUserDetails
      ?.filter(({ userId }) => userId)
      .map(({ userId }) => userId)

  const existingInternalUserIds = () =>
    internalUserDetails
      ?.filter(({ internalUserId }) => internalUserId)
      .map(({ internalUserId }) => internalUserId)

  internalUserDetails.forEach((user) => {
    const remoteInternalUser = internalUserDetailsWithIds
      ?.filter(
        ({ internalUserId }) =>
          !existingInternalUserIds().includes(internalUserId),
      )
      .find(({ email }) => email && email === user.email)

    const internalUserDetailsWithIds1 = internalUserDetailsWithIds?.filter(
      (userWithId) =>
        ((userWithId.internalUserId === user.internalUserId &&
          user.internalUserId) ||
          (userWithId.userId === user.userId && user.userId) ||
          (userWithId.userType === user.userType && user.userType) ||
          (userWithId.email === user.email && user.email) ||
          (`${userWithId.firstName}${userWithId.lastName}` ===
            `${user.firstName}${user.lastName}` &&
            `${user.firstName}${user.lastName}`)) &&
        !(userWithId.email !== user.email && userWithId.email && user.email),
    )

    const unusedUserIds = internalUserDetailsWithIds1
      ?.filter(({ userId }) => userId && !existingUserIds().includes(userId))
      .map(({ userId }) => userId)

    const unusedInternalUserIds = internalUserDetailsWithIds1
      ?.filter(
        ({ internalUserId }) =>
          internalUserId && !existingInternalUserIds().includes(internalUserId),
      )
      .map(({ internalUserId }) => internalUserId)

    user.internalUserId =
      remoteInternalUser?.internalUserId ||
      user.internalUserId ||
      unusedInternalUserIds?.[0]

    user.userId =
      remoteInternalUser?.userId || user.userId || unusedUserIds?.[0]
  })
}

async function callUpdateRfp({ getters }, payload) {
  gaEvent({
    action: 'update-presentation',
    event_category: 'presentation',
    event_label: 'User-update-presentation',
  })

  const rfp = payload.payload

  if (rfp.internalTeamDetailList) {
    const presentationState = getters.getPresentationById(rfp.presentationId)
    rfp.internalTeamDetailList = rfp.internalTeamDetailList.filter(
      (member) =>
        (member.email ||
          member.firstName ||
          member.lastName ||
          member.userId) &&
        member.role !== 'OWNER',
    )

    saveUserIds(
      rfp.internalTeamDetailList,
      presentationState?.internalUserDetails,
    )
  }

  const updatedRfp = await updateRfp(payload.key, rfp)

  return processedPresentation(updatedRfp)
}

export const getUpdateRfpPayloads = (presentationId, presentation) => ({
  contact: {
    payload: {
      presentationId: presentationId,
      contact: JSON.stringify(
        presentation.contact.filter(
          (contactItem) =>
            contactItem.email || contactItem.name || contactItem.role,
        ),
      ),
      customerName: presentation.customerName,
      customerProblem: presentation.customerProblem,
      ownerId: presentation.owner,
      version: (presentation.presentationVersions.update_PRESENTATION || 1) + 1,
    },
  },
  tier: {
    key: 'tier',
    payload: {
      presentationId: presentationId,
      tier: presentation.tier,
      version: (presentation.presentationVersions.tier || 1) + 1,
    },
  },
  internalUserDetails: {
    key: 'internal-team',
    payload: {
      internalTeamDetailList: presentation.internalUserDetails.filter(
        (member) =>
          (member.email ||
            member.firstName ||
            member.lastName ||
            member.userId) &&
          member.role !== 'OWNER',
      ),
      presentationId: presentationId,
      version: (presentation.presentationVersions.internal_USER || 1) + 1,
    },
  },
  stakeholders: {
    key: 'stakeholder',
    payload: {
      presentationId: presentationId,
      stakeHolder: JSON.stringify(presentation.stakeholders),
      version: (presentation.presentationVersions.stakeholders || 1) + 1,
    },
  },
  discovery: {
    key: 'discovery',
    payload: {
      presentationId: presentationId,
      discovery: JSON.stringify(presentation.discovery),
      version: (presentation.presentationVersions.discovery || 1) + 1,
    },
  },
  contract: {
    key: 'contract',
    payload: {
      presentationId: presentationId,
      contract: JSON.stringify(presentation.contract),
      version: (presentation.presentationVersions.contract || 1) + 1,
    },
  },
  slideSelection: {
    key: 'slide-selection',
    payload: {
      presentationId: presentationId,
      slideSelection: JSON.stringify(presentation.slideSelection),
      version: (presentation.presentationVersions.slideSelection || 1) + 1,
    },
  },
  slides: {
    key: 'slide-info',
    payload: {
      presentationId: presentationId,
      slideInfoDetailList: presentation.slides.map((slide) => ({
        slideInfoId: slide.slideInfoId,
        isEnabled: slide.isEnabled,
        version: (slide.version || 1) + 1,
      })),
    },
  },
})

export default {
  state: {
    myRfps: [],
    publishedLinks: [],
    currentRfp: emptyCurrentRfpDefault(),
  },

  getters: {
    myRfps(state) {
      return state.myRfps
    },
    getDraftRfps(state) {
      return [
        ...state.myRfps.filter(
          ({ publicationCount }) => publicationCount === 0,
        ),
      ].sort((rfp1, rfp2) =>
        rfp2.lastUpdatedDate?.localeCompare(rfp1.lastUpdatedDate),
      )
    },
    getPublishedLinks(state) {
      return state.publishedLinks
    },
    getPublishedLinksByPresentationId: (state) => (presentationId) => {
      return state.publishedLinks.filter(
        (publishedLink) => publishedLink.presentationId === presentationId,
      )
    },
    getPublishedLinksByLinkName: (state) => (linkName) => {
      return state.publishedLinks.find(
        (publishedLink) => publishedLink.linkName == linkName,
      )
    },
    publishedRfpIds(state, getters, rootState, rootGetters) {
      const presentationIds1 = state.publishedLinks.map(
        ({ presentationId }) => presentationId,
      )
      const presentationIds2 = Object.keys(rootGetters['link/rfpLinks'])
      return [...presentationIds1, ...presentationIds2]
    },
    getPublishedRfps(state) {
      return [
        ...state.myRfps.filter(({ publicationCount }) => publicationCount > 0),
      ].sort((rfp1, rfp2) =>
        rfp2.lastUpdatedDate?.localeCompare(rfp1.lastUpdatedDate),
      )
    },
    sharedWithMe(state, getters, rootState, rootGetters) {
      const userId = rootGetters['setting/userId']
      return state.myRfps
        .filter((rfp) => rfp.owner !== userId)
        .map((rfp) => {
          const shareDetail = rfp.internalUserDetails.find(
            (user) => user.internalUserId == userId,
          )
          const owner = rfp.internalUserDetails.find(
            (user) => user.internalUserId == rfp.owner,
          )

          return {
            customerName: rfp.customerName,
            owner: owner,
            sharedBy: owner, // TODO: update to shared by user when the field is added in the api
            role: shareDetail?.role,
            presentationId: rfp.presentationId,
          }
        })
    },

    getPresentationById: (state) => (id) => {
      const presentation = id
        ? state.myRfps.find((rfp) => rfp.presentationId == id)
        : state.currentRfp

      if (!presentation) return

      return cloneDeep(processedPresentation(presentation))
    },

    getCollaboratorsByPresentationId: (state) => (id) => {
      return state.myRfps.find((rfp) => rfp.presentationId === id)
    },

    selectedSlides(state) {
      return state.selectedSlides
    },
    getCurrentRfp(state) {
      return state.currentRfp
    },
    getEmptyCurrentRfp() {
      return emptyCurrentRfpDefault()
    },

    getCurrentRfpSlides(state) {
      let slides = []
      state.currentRfp.slides.forEach((slideGroup) =>
        slides.push(...slideGroup.slides),
      )
      return slides
    },
    getNonCustomSlidesByPresentationId:
      (state, getters) => (presentationId) => {
        const allSlides =
          getters.getSlidesByPresentationId(presentationId) || []
        return allSlides.filter((slide) => slide.customSlideType == undefined)
      },

    getSlidesByPresentationId: (state, getters) => (presentationId) => {
      const presentation = getters.getPresentationById(presentationId)

      if (presentation)
        return [...(presentation.slides || [])].sort(
          ({ pageNumber: pageNumber1 }, { pageNumber: pageNumber2 }) =>
            pageNumber1 - pageNumber2,
        )
    },

    getLinkByHyperLink: (state) => (clientName, hyperLink) => {
      return state.publishedLinks.find(
        (link) =>
          link.hyperLink === hyperLink && link.clientName === clientName,
      )
    },

    getSlidesByHyperLink: (state, getters) => (clientName, hyperLink) => {
      const link = getters.getLinkByHyperLink(clientName, hyperLink)

      if (link)
        return [...(link.slides || [])].sort(
          ({ pageNumber: pageNumber1 }, { pageNumber: pageNumber2 }) =>
            pageNumber1 - pageNumber2,
        )
    },

    getEnabledSlidesByPresentationId:
      (state, getters) =>
      ({ presentationId, hyperLink, clientName }) => {
        const slides = hyperLink
          ? getters.getSlidesByHyperLink(clientName, hyperLink)
          : getters.getSlidesByPresentationId(presentationId)

        if (slides) return slides.filter(({ isEnabled }) => isEnabled)
      },

    getDisplayedSlidesByPresentationId:
      (state, getters) =>
      ({ presentationId, hyperLink, clientName }) => {
        const enabledSlides = getters.getEnabledSlidesByPresentationId({
          presentationId,
          hyperLink,
          clientName,
        })

        if (enabledSlides) {
          return enabledSlides.filter((slideFull) => {
            const slide = {
              ...slideFull,
              ...slideDetails(slideFull.slide || slideFull),
            }

            const isPartnershipSlide = (
              slide.slideCode || slide.customSlideType
            ).includes('_PPH')
            if (!isPartnershipSlide) return true

            const CatrgorySlideCount = enabledSlides.filter(
              ({ slideCategory }) => slideCategory == slide.slideCategory,
            ).length
            return CatrgorySlideCount > 1
          })
        }
      },

    getEnabledSlidesByLinkName: (state, getters) => (LinkName) => {
      const slides = getters.getSlidesByLinkName(LinkName)
      if (slides) return slides.filter(({ isEnabled }) => isEnabled)
    },

    enabledDynamicSlidesByPresentationId:
      (state, getters) => (presentationId) => {
        const slides =
          getters.getEnabledSlidesByPresentationId({ presentationId }) || []

        return slides.filter(({ slide }) => slide.slideType === 'DYNAMIC')
      },

    enabledSlideNumber:
      (state, getters) =>
      ({ presentationId, slideId, hyperLink, clientName }) => {
        const enabledSlides = getters.getDisplayedSlidesByPresentationId({
          presentationId,
          hyperLink,
          clientName,
        })

        if (enabledSlides)
          return (
            enabledSlides.findIndex(
              (slide) =>
                (slide.slideId ||
                  slide.slide?.prePopulatedSlide ||
                  slide.prePopulatedSlide) === slideId,
            ) + 1
          )
      },

    enabledSlideNumberPerCategory:
      (state, getters) =>
      ({ presentationId, hyperLink, slideCategory, clientName }) => {
        const enabledSlides = getters.getDisplayedSlidesByPresentationId({
          presentationId,
          hyperLink,
          clientName,
        })

        if (enabledSlides)
          return enabledSlides.findIndex(
            (slide) => slide.slideCategory === slideCategory,
          )
      },

    getslideContentBySlideId:
      (state, getters) =>
      ({ presentationId, prePopulatedSlide, hyperLink, clientName }) => {
        const slides = hyperLink
          ? getters.getSlidesByHyperLink(clientName, hyperLink)
          : getters.getSlidesByPresentationId(presentationId)

        const slide = slides?.find(
          (slide) =>
            slide.slide?.prePopulatedSlide === prePopulatedSlide ||
            slide.prePopulatedSlide === prePopulatedSlide,
        )

        const slideContent = slide?.slide?.slideContent || slide?.slideContent

        return slideContent
          ? JSON.parse(slideContent)
          : defaultSlideContents[prePopulatedSlide]
      },

    getSlideContentByRoute:
      (state, getters) =>
      ({ route, slideId }) => {
        const slideContent = getters.getslideContentBySlideId({
          presentationId: route.params.presentationId,
          prePopulatedSlide: route.params.slideId || slideId,
          hyperLink: route.params.hyperLink,
          clientName: route.params.clientName,
        })
        return slideContent
      },

    getSlideBySlideId: (state, getters) => (payload) => {
      const slides = getters.getSlidesByPresentationId(payload.presentationId)

      const slide = slides?.find(
        (slide) => slide.slide.prePopulatedSlide === payload.prePopulatedSlide,
      )

      return slide?.slide
    },
    getCustomerNameByPresentationId: (state) => (presentationId) => {
      const presentation = state.myRfps.find(
        (presentation) => presentation.presentationId === presentationId,
      )

      return presentation?.customerName
    },

    getInputedStepsCounts: (state, getters) => (presentationId) => {
      const wizardSteps = [
        'update_PRESENTATION',
        'internal_USER',
        'stakeholders',
        'discovery',
        'contract',
        'slideSelection',
        'slide_INFOS',
        'builders',
        'link',
      ]
      const editedVersions = wizardSteps.filter((step) =>
        getters.getInputProgressByPresentationId(presentationId, step),
      )
      return editedVersions.length
    },

    getInputProgressByPresentationId:
      (state, getters) => (presentationId, versionKey) => {
        const presentation = getters.getPresentationById(presentationId)
        if (presentation) {
          if (versionKey == 'builders') {
            const editedSlides = presentation.slides.filter(
              ({ slide }) => slide.version > 0,
            )
            return editedSlides.length > 0
          } else if (versionKey == 'internal_USER' || versionKey == 'tier') {
            const userVersion = presentation.presentationVersions.internal_USER
            const tierVersion = presentation.presentationVersions.tier
            return userVersion > 1 || tierVersion > 0
          } else if (versionKey == 'slide_INFOS') {
            const slideInfosVersion =
              presentation.presentationVersions.slide_INFOS
            const enabledSlides = presentation.slides.filter(
              ({ isEnabled }) => isEnabled,
            )
            return slideInfosVersion > 0 || enabledSlides.length > 0
          } else if (versionKey == 'update_PRESENTATION') {
            const updatePresentaionVersion =
              presentation.presentationVersions.update_PRESENTATION
            const isEdited = Boolean(
              presentation.customerProblem || presentation.contact?.length > 0,
            )
            return updatePresentaionVersion > 0 || isEdited
          } else if (versionKey == 'link') {
            return presentation.publicationCount > 0
          }
          const versionValue = presentation.presentationVersions[versionKey]
          return versionValue > 0
        }
      },
    getLastBuilderPage: (state, getters) => (presentationId) => {
      const enabledDynamicSlides =
        getters.enabledDynamicSlidesByPresentationId(presentationId)

      const lastEnabledDynamicSlide =
        enabledDynamicSlides[enabledDynamicSlides.length - 1]

      return lastEnabledDynamicSlide?.slide.prePopulatedSlide || 'INTRO1'
    },
  },

  mutations: {
    setMyRfps(state, myRfps) {
      state.myRfps = myRfps
    },

    setPublishedLinks(state, payload) {
      state.publishedLinks = payload
    },

    // eg. use case when slides is assigned for presentation from template
    setPresentationSlide(state, { presentationId, templateSlides }) {
      const presentation = state.myRfps.find(
        (presentation) => presentation.presentationId === presentationId,
      )

      const correspondingTemplateSlide = (rfpSlide) =>
        templateSlides.find(
          (templateSlide) =>
            templateSlide.slide.prePopulatedSlide ===
            rfpSlide.slide.prePopulatedSlide,
        )

      presentation.slides.forEach((rfpSlide) => {
        rfpSlide.isEnabled = Boolean(
          correspondingTemplateSlide(rfpSlide)?.isEnabled,
        )
      })
    },

    setCurrentRfp(state, payload) {
      state.currentRfp = cloneDeep(payload)
    },

    updateRfp(state, updatedRfp) {
      const tempRfps = state.myRfps.filter(
        ({ presentationId }) => presentationId !== updatedRfp.presentationId,
      )

      const oldRfp =
        state.myRfps.find(
          ({ presentationId }) => presentationId === updatedRfp.presentationId,
        ) || {}

      const internalUserDetails = updatedRfp.internalUserDetails || []

      saveUserIds(internalUserDetails, oldRfp?.internalUserDetails)

      const fullUpdatedRfp = cloneDeep({
        ...oldRfp,
        ...updatedRfp,
        internalUserDetails,
      })

      tempRfps.push(fullUpdatedRfp)

      state.myRfps = tempRfps
    },

    updateLink(state, updatedLink) {
      const tempRfpLinks = state.publishedLinks.filter(
        ({ id }) => id !== updatedLink.id,
      )
      tempRfpLinks.push(updatedLink)
      state.publishedLinks = tempRfpLinks
    },

    // slide Id param
    toggleSlideSelection(state, payload) {
      const rfp = state.myRfps.find(
        (rfp) => rfp.presentationId == payload.presentationId,
      )
      const slide = rfp.slides.find(
        (slide) =>
          slide.slideInfoId === payload.slideId ||
          slide.slide.prePopulatedSlide == payload.slideId,
      )

      if (slide) {
        slide.isEnabled = !slide.isEnabled
        slide.selected = slide.isEnabled
      }
      gaEvent({
        action: 'builder-toggle-slide-selection-click',
        event_category: 'dashboard',
        event_label: 'User-clicked-builder-toggle-slide-selection-btn',
      })
    },
    switchSlideSelection(state, { presentationId, slideCode, isEnabledValue }) {
      const rfp = state.myRfps.find(
        (rfp) => rfp.presentationId == presentationId,
      )
      const slide = rfp.slides.find(
        (slide) =>
          slide.slideCode === slideCode ||
          slide.slide.prePopulatedSlide === slideCode,
      )

      if (slide) {
        slide.isEnabled = isEnabledValue
        slide.selected = slide.isEnabled
      }
    },

    setShareWith(state, payload) {
      let presentation = state.myRfps.find(
        (presentation) =>
          presentation.presentationId === payload.presentationId,
      )
      presentation.internalUserDetails = payload.internalUserDetails
    },

    roleUpdate(state, payload) {
      if (payload.role === 'EDITOR' || payload.role === 'VIEWER') {
        let presentation = state.myRfps.find(
          (presentation) =>
            presentation.presentationId === payload.presentationId,
        )
        let sharedWith = presentation.internalUserDetails.find(
          (sharedWith) =>
            sharedWith.internalUserId ===
            payload.internalTeamDetail.internalUserId,
        )
        sharedWith.role = payload.role
      }
      if (payload.role === 'NONE') {
        let presentation = state.myRfps.find(
          (presentation) =>
            presentation.presentationId === payload.presentationId,
        )
        let sharewith = presentation.internalUserDetails.findIndex(
          (sharedWith) =>
            sharedWith.internalUserDetails ===
            payload.internalTeamDetail.internalUserId,
        )
        presentation.internalUserDetails.splice(sharewith, 1)
      }
    },
    setSlideContentUpdate(state, payload) {
      let presentation = state.myRfps.find(
        (presentation) =>
          presentation.presentationId === payload.presentationId,
      )
      let slides = presentation.slides
      let slide = slides.find(
        (slide) => slide.slide.prePopulatedSlide === payload.prePopulatedSlide,
      ).slide

      slide.slideContent = payload.slideContent

      slide.slideContent = payload.slideContent || slide.slideContent
      slide.customSlideType = payload.customSlideType || slide.customSlideType
      slide.slideType = payload.slideType || slide.slideType
      slide.version = payload.version || slide.version
    },
    deleteRow(state, presentationId) {
      const rfpIndex = state.myRfps.findIndex(
        (rfp) => rfp.presentationId === presentationId,
      )
      state.myRfps.splice(rfpIndex, 1)
    },
    deleteLink(state, payload) {
      const publishedLinkIndex = state.publishedLinks.findIndex(
        (publishedLink) => publishedLink.id === payload,
      )
      state.publishedLinks.splice(publishedLinkIndex, 1)
    },
    updatePresentationVersions(
      state,
      { presentationId, presentationVersions, internalUserDetails },
    ) {
      const presentation = state.myRfps.find(
        (presentation) => presentation.presentationId === presentationId,
      )
      presentation.presentationVersions = presentationVersions

      saveUserIds(presentation.internalUserDetails, internalUserDetails)
    },
  },

  actions: {
    async createRfp({ commit, dispatch }, payload) {
      gaEvent({
        action: 'create-presentation',
        event_category: 'presentation',
        event_label: 'User-create-presentation',
      })
      const { id: userId } = await dispatch('setting/fetchUser', false, {
        root: true,
      })

      const customerNameIsInvalid = /[-/:?#[\]@!$&'()*+,;=\\]+/.test(
        payload.customerName,
      )
      if (customerNameIsInvalid) throw 'Customer Name Contains Invalid Values'

      let rfp = await createRfp({ ownerId: userId, ...payload })
      rfp = processedPresentation(rfp)

      commit('updateRfp', rfp)

      commit('setCurrentRfp', emptyCurrentRfpDefault())

      return rfp
    },
    async deleteRfp({ commit }, payload) {
      gaEvent({
        action: 'delete-presentation',
        event_category: 'presentation',
        event_label: 'User-delete-presentation',
        presentationIdParam: payload,
      })
      commit('deleteRow', payload)
      await deleteRfp(payload)
    },

    async saveRfpChanges({ getters, commit }, { presentationId, updateType }) {
      gaEvent({
        action: `save-presentation-changes-${updateType}`,
        event_category: 'presentation',
        event_label: 'User-save-presentation-changes',
        presentationIdParam: presentationId,
      })
      const presentation = getters.getPresentationById(presentationId)

      const customerNameIsInvalid = /[-/:?#[\]@!$&'()*+,;=\\]+/.test(
        presentation.customerName,
      )
      if (customerNameIsInvalid) throw 'Customer Name Contains Invalid Values'

      const updateRfpPayloads = getUpdateRfpPayloads(
        presentationId,
        presentation,
      )

      if (updateType === 'slideSelection') {
        await callUpdateRfp({ getters }, updateRfpPayloads.slides)
      }

      if (updateType === 'internalUserDetails') {
        await callUpdateRfp({ getters }, updateRfpPayloads.tier)
      }

      const updatedRfp = await callUpdateRfp(
        { getters },
        updateRfpPayloads[updateType],
      )

      commit('updatePresentationVersions', {
        presentationId: presentationId,
        presentationVersions: updatedRfp.presentationVersions,
        internalUserDetails: updatedRfp.internalUserDetails,
      })
      return updatedRfp
    },

    async sharedWithAction({ commit }, payload) {
      gaEvent({
        action: 'share-with-action',
        event_category: 'presentation',
        event_label: 'User-share-with-action',
      })

      try {
        let sharedTemplate = await shareRfp(payload)
        commit('setShareWith', sharedTemplate)
      } catch (err) {
        console.error(err.response || err)
        throw err
      }
    },

    async shareWithUser({ commit, getters }, payload) {
      gaEvent({
        action: 'share-with-user',
        event_category: 'presentation',
        event_label: 'User-share-with-user',
        presentationIdParam: payload.presentationId,
      })
      const presentation = getters.getPresentationById(payload.presentationId)

      try {
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
          tier: presentation.tier || 'TIER_4',
        }
        await shareRfp(data)
        commit('roleUpdate', payload)
      } catch (err) {
        console.error(err.response || err)
        throw err
      }
    },
    async fetchMyRfps(
      { commit, dispatch, state },
      { limit, page, ownedByMe, sharedWithMe, isPublished, notPublished } = {},
    ) {
      gaEvent({
        action: 'fetch-my-presentations',
        event_category: 'presentation',
        event_label: 'User-fetch-my-presentations',
      })
      try {
        const { id: userId } = await dispatch('setting/fetchUser', false, {
          root: true,
        })

        let myRfps = await getMyrfps(userId, {
          limit,
          page,
          ownedByMe,
          sharedWithMe,
          isPublished,
          notPublished,
        })
        myRfps = myRfps.map((rfp) => processedPresentation(rfp, state))

        myRfps.sort((rfp1, rfp2) =>
          rfp2.createdDate.localeCompare(rfp1.createdDate),
        )
        myRfps.forEach((rfp) => commit('updateRfp', rfp))

        return { response: myRfps }
      } catch (err) {
        console.error('Cannot fetch rfps: ', err)
        return { err }
      }
    },

    async getMyRfpbyId({ commit }, presentationId) {
      gaEvent({
        action: 'get-my-presentation-byId',
        event_category: 'presentation',
        event_label: 'User-get-my-presentation-byId',
        presentationIdParam: presentationId,
      })

      try {
        let rfp = await getMyRfp(presentationId)

        rfp = processedPresentation(rfp)

        commit('updateRfp', rfp)
        return { rfp }
      } catch (err) {
        console.error('Error fetching Rfp ', err)
        return { err }
      }
    },

    async getLinkByHyperLink({ commit }, { clientName, hyperLink }) {
      gaEvent({
        action: 'get-link-by-hyperLink',
        event_category: 'presentation',
        event_label: 'User-get-link-by-hyperLink',
      })
      try {
        const link = await getLinkByHyperLink(clientName, hyperLink)

        commit('updateLink', link)
        return { link }
      } catch (err) {
        console.error('Error fetching published link ', err)
        return { err }
      }
    },

    async getLinkByHyperLinkAndToken(
      { commit },
      { clientName, hyperLink, token },
    ) {
      try {
        const link = await getLinkByHyperLinkAndToken(
          clientName,
          hyperLink,
          token,
        )

        commit('updateLink', link)
        return { link }
      } catch (err) {
        console.error('Error fetching published link ', err)
        return { err }
      }
    },

    async syncLink({ commit }, id) {
      try {
        const link = await syncLink(id)
        commit('updateLink', link)
      } catch (err) {
        console.error('Error syncing link ', err)
        return { err }
      }
    },

    async getPublishedLinks({ commit, dispatch }, { limit, page } = {}) {
      gaEvent({
        action: 'get-published-link',
        event_category: 'presentation',
        event_label: 'User-get-published-link',
      })
      try {
        const { id: userId } = await dispatch('setting/fetchUser', false, {
          root: true,
        })

        const links = await getPublishedLinks(userId, limit, page)
        links.forEach((link) => commit('updateLink', link))

        return { links }
      } catch (err) {
        console.error('Error fetching published links ', err)
        return { err }
      }
    },

    async deletePublishLink({ commit }, payload) {
      gaEvent({
        action: 'delete-published-link',
        event_category: 'presentation',
        event_label: 'User-delete-published-link',
      })
      try {
        commit('deleteLink', payload)
        await deletePublishLink(payload)
      } catch (err) {
        console.error('Error delete published links ', err)
        return { err }
      }
    },

    async updateDraftLocal({ commit }, payload) {
      gaEvent({
        action: 'update-draft-local',
        event_category: 'presentation',
        event_label: 'User-update-draft-local',
        presentationIdParam: payload.presentationId,
      })
      commit('setSlideContentUpdate', {
        presentationId: payload.presentationId,
        prePopulatedSlide: payload.prePopulatedSlide,
        slideContent: payload.content,
      })
    },

    async updateSlideContent({ commit, getters }, payload) {
      gaEvent({
        action: 'update-draft-content',
        event_category: 'presentation',
        event_label: 'User-update-draft-content',
        presentationIdParam: payload.presentationId,
      })

      const { version, slideId } = getters.getSlideBySlideId({
        presentationId: payload.presentationId,
        prePopulatedSlide: payload.prePopulatedSlide,
      })
      const updateDraftBody = {
        content: payload.content,
        presentationId: payload.presentationId,
        slideId,
        version: (version || 0) + 1,
      }

      try {
        commit('setSlideContentUpdate', {
          presentationId: payload.presentationId,
          prePopulatedSlide: payload.prePopulatedSlide,
          slideContent: payload.content,
        })

        const updatedSlide = await updateSlideContent(updateDraftBody)
        updatedSlide.presentationId = payload.presentationId
        commit('setSlideContentUpdate', updatedSlide)

        return updatedSlide
      } catch (err) {
        console.error('Cannot update the Draft: ', err)
        throw err.message || err
      }
    },
  },
}
