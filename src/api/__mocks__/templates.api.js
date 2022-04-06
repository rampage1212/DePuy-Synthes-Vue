/*eslint-env node, jest, amd*/
import { mockUserDetail } from '../../../tests/__data__/auth/authData.js'
import {
  getTemplates,
  getCreateTemplate,
  getShareTemplate,
  getOneTemplate,
  getUpdatedTemplate,
} from '../../../tests/__data__/templates/sampleTemplateData'

const getAllTemplates = jest.fn(() => Promise.resolve(getTemplates()))

const deleteTemplate = jest.fn(() => Promise.resolve({}))
const getTemplate = jest.fn(() => Promise.resolve(getOneTemplate()))

let newTemplateIndex = 0
const createTemplate = jest.fn((payload) => {
  newTemplateIndex++
  return Promise.resolve({
    ...getCreateTemplate(),
    ...payload,
    ownerId: mockUserDetail.id,
    templateId: `new-template-${newTemplateIndex}`,
  })
})
const updateTemplate = jest.fn(() => Promise.resolve(getUpdatedTemplate()))
const shareTemplate = jest.fn(() => Promise.resolve(getShareTemplate()))

export {
  getAllTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  shareTemplate,
  deleteTemplate,
}
