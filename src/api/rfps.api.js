import { get, post, put, del } from './httpClient.js'

const path = '/presentation'

const getMyrfps = (
  userId,
  { limit = '', page = 0, ownedByMe, sharedWithMe, isPublished, notPublished },
) =>
  get(`${path}/user/${userId}/filter`, {
    page,
    limit,
    sharedWithCurrentUser: sharedWithMe || '',
    ownedByCurrentUser: ownedByMe || '',
    publication: notPublished ? 0 : isPublished ? 1 : '',
  })

const getMyRfp = (presentationId) => get(`${path}/${presentationId}`)
const createRfp = (payload) => post(path, payload)
const deleteRfp = (presentationId) =>
  del(`${path}/${presentationId}`, {}, { presentationId })

const updateRfp = (subPath, payload) => put(`${path}/${subPath || ''}`, payload)

const shareRfp = async (rfpPayload) =>
  await put('/presentation/internal-team', rfpPayload)

const updateSlideContent = (slide) => put('/slide/content', slide)

const insertCustomSlide = (payload) => put(`${path}/insert-slide`, payload)

export {
  getMyrfps,
  getMyRfp,
  createRfp,
  updateRfp,
  shareRfp,
  updateSlideContent,
  deleteRfp,
  insertCustomSlide,
}
