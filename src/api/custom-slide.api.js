import { get, post, put, del } from './httpClient.js'

const path = '/slide'

const createSlide = ({
  ownerId,
  slideCategory,
  pageNumber,
  slideData,
  customSlideType,
}) =>
  post(path, {
    ownerId,
    slideCategory,
    pageNumber,
    slideData,
    customSlideType,
  })

const fetchCustomSlidesByOwnerId = (ownerId) =>
  get(`${path}/customSlides/owner/${ownerId}`)

const deleteCustomSlide = (customSlideId) => del(`${path}/${customSlideId}`)

const updateCustomSlide = ({
  slideInfoId,
  slideCategory,
  pageNumber,
  slideData,
}) => put(path, { slideInfoId, slideCategory, pageNumber, slideData })

export {
  createSlide,
  fetchCustomSlidesByOwnerId,
  updateCustomSlide,
  deleteCustomSlide,
}
