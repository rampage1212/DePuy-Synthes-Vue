import templates from './sampleTemplates.json'
import template from './sampleGetTemplate.json'
import saveAsTemplate from './sampleSaveAsTemplate.json'
import updatedTemplate from './sampleUpdateTemplate.json'
import shareTemplate from './sampleShareTemplate.json'
import createTemplate from './sampleCreateTemplate.json'
import { mockUserDetail } from '../auth/authData.js'

function getTemplates() {
  const templatesTo = JSON.parse(JSON.stringify(templates))
  templatesTo[0].ownerId = mockUserDetail.id
  return JSON.parse(JSON.stringify(templatesTo))
}
function getOneTemplate() {
  return JSON.parse(JSON.stringify(template))
}
function getSaveAsTemplate() {
  return JSON.parse(JSON.stringify(saveAsTemplate))
}
function getUpdatedTemplate() {
  return JSON.parse(JSON.stringify(updatedTemplate))
}
function getShareTemplate() {
  return JSON.parse(JSON.stringify(shareTemplate))
}
function getCreateTemplate() {
  return JSON.parse(JSON.stringify(createTemplate))
}

export {
  getCreateTemplate,
  getSaveAsTemplate,
  getOneTemplate,
  getTemplates,
  getShareTemplate,
  getUpdatedTemplate,
}
