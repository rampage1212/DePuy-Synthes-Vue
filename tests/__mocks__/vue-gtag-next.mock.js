/*eslint-env node, jest, amd*/
import * as gTag from 'vue-gtag-next'

// eslint-disable-next-line no-import-assign
gTag.useGtag = jest.fn(() => ({ event: jest.fn() }))

module.exports = gTag
