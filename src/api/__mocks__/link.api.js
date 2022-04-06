/*eslint-env node, jest, amd*/
import { getPublishedLinksJson } from '../../../tests/__data__/rfps/sampleLinks'
import {
  getPublishedLinkUnderPresentation,
  getCreateLinkResponse,
} from '../../../tests/__data__/link/linkData'
const sampleLink = 'sampleLinkFromHyperLink'
const publishedLinks = ['link1', 'link2', 'link3']
const getRfpLinks = jest.fn(() =>
  Promise.resolve(getPublishedLinkUnderPresentation()),
)

const deletePublishLink = jest.fn(() => Promise.resolve())

const publishLink = jest.fn((payload) =>
  Promise.resolve({ ...getCreateLinkResponse(), ...payload }),
)

const getPublishedLinks = jest.fn(() =>
  Promise.resolve(getPublishedLinksJson()),
)

const getLinkByHyperLink = jest.fn(() => Promise.resolve(sampleLink))

const getLinkByHyperLinkAndToken = jest.fn(() => Promise.resolve(sampleLink))

const syncLink = jest.fn(() => Promise.resolve(sampleLink))

export {
  publishLink,
  getLinkByHyperLink,
  getLinkByHyperLinkAndToken,
  getRfpLinks,
  getPublishedLinks,
  deletePublishLink,
  syncLink,
  publishedLinks,
  sampleLink,
}
