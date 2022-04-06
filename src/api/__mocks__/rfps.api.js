/*eslint-env node, jest, amd*/
import {
  getCreatedRfp,
  getUpdatedRfp,
  getMyRfps,
  getShareRfpPayload,
  getUpdatedSlideContent,
} from '../../../tests/__data__/rfps/sampleRfps'
import { getInsertSlideResp } from '../../../tests/__data__/customSlide/customSlideData'

const getMyrfps = jest.fn(() => Promise.resolve(getMyRfps()))
const getMyRfp = jest.fn(() => Promise.resolve(getMyRfps()[0]))

const createRfp = jest.fn((payload) =>
  Promise.resolve({ ...getCreatedRfp(), ...payload }),
)

const deleteRfp = jest.fn(() => Promise.resolve())

const updateRfp = jest.fn(() => Promise.resolve(getUpdatedRfp()))

const shareRfp = jest.fn(() => Promise.resolve(getShareRfpPayload()))

const updateSlideContent = jest.fn(() =>
  Promise.resolve(getUpdatedSlideContent()),
)

const insertCustomSlide = jest.fn((slidePayload) =>
  Promise.resolve(getInsertSlideResp(slidePayload)),
)

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
