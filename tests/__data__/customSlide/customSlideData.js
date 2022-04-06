import customSlide from './createdSlide.json'
import customSlidesByOwnerId from './getCustomSlidesByOwnerId.json'
import updatedCustomSlide from './updatedCustomSlide.json'
import insertSlideReq from './insertSlideRequest.json'
import insertSlideRes from './insertSlideResponse.json'

const defaultCustomeSlide = () => ({
  slideTitle: '',
  subTitle: '',
  slideCategory: 'INTRODUCTION',
  pageNumber: 1,
  customSlideType: 'CUSTOM_SLIDE_1',
  version: 0,
  showTitle: true,
  showSubtitle: true,
  showImages: true,
  numberOfImages: 0,
})

const emptyCustomeSlide = () => ({
  slideInfoId: '',
  slideCategory: 'INTRODUCTION',
  pageNumber: 1,
  slide: {
    slideId: '',
    slideContent: defaultCustomeSlide(),
    version: 0,
    prePopulatedSlide: '',
    slideType: 'CUSTOM',
    customSlideType: 'CUSTOM_SLIDE_1',
  },
  isEnabled: true,
})

function getCreatedSlide() {
  return JSON.parse(JSON.stringify(customSlide))
}

function getCustomSlidesByOwnerId() {
  return JSON.parse(JSON.stringify(customSlidesByOwnerId))
}

function getUpdatedCustomSlide() {
  return JSON.parse(JSON.stringify(updatedCustomSlide))
}
function getInsertSlideReq() {
  return JSON.parse(JSON.stringify(insertSlideReq))
}
function getInsertSlideResp(slidePayload) {
  const insertSlideResClone = JSON.parse(JSON.stringify(insertSlideRes))
  insertSlideResClone.slides.push({ ...slidePayload, slide: slidePayload })
  return insertSlideResClone
}

export {
  getCreatedSlide,
  getCustomSlidesByOwnerId,
  getUpdatedCustomSlide,
  emptyCustomeSlide,
  getInsertSlideReq,
  getInsertSlideResp,
}
