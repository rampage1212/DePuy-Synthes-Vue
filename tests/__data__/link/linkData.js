import getPublishedLinkUnderPresentationJson from './getPublishedLinkUnderPresentation.json'
import createLinkRequest from './createLinkRequest.json'
import createLinkResponse from './createLinkResponse.json'
import updateLinkRequest from './updateLinkRequest.json'

const getPublishedLinkUnderPresentation = () =>
  JSON.parse(JSON.stringify(getPublishedLinkUnderPresentationJson))
const getCreateLinkRequest = () => JSON.parse(JSON.stringify(createLinkRequest))
const getCreateLinkResponse = () =>
  JSON.parse(JSON.stringify(createLinkResponse))
const getUpdateLinkRequest = () => JSON.parse(JSON.stringify(updateLinkRequest))
export {
  getPublishedLinkUnderPresentation,
  getCreateLinkRequest,
  getCreateLinkResponse,
  getUpdateLinkRequest,
}
