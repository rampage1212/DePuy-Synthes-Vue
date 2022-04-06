import { get, post, put, del } from './httpClient.js'

const path = '/template'

const getAllTemplates = async (userId, limit, page) =>
  await get(`/template/all/${userId}?page=${page ?? ''}&limit=${limit || ''}`)

const deleteTemplate = async (template_id) =>
  await del(`/template/${template_id}`, {}, { templateId: template_id })
const getTemplate = async (template_id) => await get(`/template/${template_id}`)
const createTemplate = async (template) => await post(path, template)
const updateTemplate = async (template) => await put(path, template)
const shareTemplate = async (template) =>
  await put('/template/share-template', template)

export {
  getAllTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  shareTemplate,
  deleteTemplate,
}
