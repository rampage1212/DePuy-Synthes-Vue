import { getRfpLinks, publishLink, generatePdf } from '@/api/link.api.js'
import { gaEvent } from '@/utils/GA_Event.js'

export default {
  state: {
    rfpLinks: {},
  },

  getters: {
    getLinksByPresentationId:
      (state, _g, _rs, rootGetters) => (presentationId) =>
        state.rfpLinks[presentationId] ||
        rootGetters['rfps/getPublishedLinksByPresentationId'](presentationId),
    getSlidesByHyperLink: (state) => (clientName, hyperLink) => {
      for (const links of state.rfpLinks) {
        const link = links.find(
          (linkItem) =>
            linkItem.hyperLink === hyperLink && link.clientName === clientName,
        )
        return link
      }
    },
    getLinkByLinkId: (state) => (linkId) => {
      for (const presentationId in state.rfpLinks) {
        const link = state.rfpLinks[presentationId]?.find(
          (linkItem) => linkItem.id === linkId,
        )
        return link
      }
    },
    rfpLinks(state) {
      return state.rfpLinks
    },
  },

  mutations: {
    setRfpLinks(state, payload) {
      payload.links.forEach((link) => {
        link.slides.sort(
          (slideA, slideB) => slideA.pageNumber - slideB.pageNumber,
        )
      })
      state.rfpLinks[payload.presentationId] = payload.links
    },
  },

  actions: {
    async fetchRfpLinks({ commit }, presentationId) {
      gaEvent({
        action: 'fetch-presentation-link',
        event_category: 'presentation',
        event_label: 'User-fetch-presentation-link',
        presentationIdParam: presentationId,
      })
      let response = await getRfpLinks(presentationId)
      let payload = {
        links: response,
        presentationId: presentationId,
      }

      commit('setRfpLinks', payload)

      return response
    },

    async publishLink({ dispatch }, payload) {
      gaEvent({
        action: 'publish-presentation-link',
        event_category: 'presentation',
        event_label: 'User-publish-presentation-link',
        presentationIdParam: payload.presentationId,
      })

      const hyperLinkIsInvalid = /[-/:?#[\]@!$&'()*+,;=\\]+/.test(
        payload.hyperLink,
      )
      if (hyperLinkIsInvalid)
        throw `No "- / \\ : ? # [ ] @ ! $ & ' ( ) * + , ; =" allowed in hyper link`

      const publishedLink = await publishLink(payload)

      await dispatch('fetchRfpLinks', payload.presentationId)

      return publishedLink
    },

    async generatePdf(_, link) {
      try {
        return await generatePdf(link)
      } catch (err) {
        console.error('Get link pdf: ', err)
      }
    },
  },
}
