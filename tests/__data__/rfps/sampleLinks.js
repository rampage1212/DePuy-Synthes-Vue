import samplePublishedLinks from './samplePublishedLinks.json'

function getPublishedLinksJson() {
  return JSON.parse(JSON.stringify(samplePublishedLinks))
}
export { getPublishedLinksJson }
