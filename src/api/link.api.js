import { get, post, put, del, getByToken } from './httpClient.js'

const path = '/publication'

const getRfpLinks = (presentationId) =>
  get(`${path}/presentation/${presentationId}`)

const deletePublishLink = (linkId) => del(`${path}/${linkId}`)

const publishLink = (payload) =>
  payload.id ? put(path, payload) : post(path, payload)
const getPublishedLinks = (userId, limit, page) =>
  get(`${path}/user/${userId}?page=${page ?? ''}&limit=${limit || ''}`)

const getLinkByHyperLink = (clientName, hyperLink) =>
  get(`${path}/hyper-link/${clientName}/${hyperLink}`)

const getLinkByHyperLinkAndToken = (clientName, hyperLink, token) =>
  getByToken(`${path}/hyper-link/${clientName}/${hyperLink}`, token)

const syncLink = (linkId) => put(`${path}/sync/${linkId}`)

const generatePdf = ({ clientName, hyperLink }) =>
  post(`${path}/generatePdf`, { clientName, hyperLink })

export {
  publishLink,
  getLinkByHyperLink,
  getLinkByHyperLinkAndToken,
  getRfpLinks,
  getPublishedLinks,
  deletePublishLink,
  syncLink,
  generatePdf,
}
