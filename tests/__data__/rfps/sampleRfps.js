import defaultPresentationConfig from '@/data/defaultPresentationConfig.json'
import overviewSlides from '@/data/allSlides'
import sampleMyRfps from './sampleMyRfps.json'
import sampleCreatedRfp from './sampleCreatedRfp.json'

const SAMPLE_CONTACTS = [
  {
    name: 'Contact 1',
    role: 'COO',
    email: 'contact1@depuy.com',
  },
  {
    name: 'Contact 2',
    role: 'CEO',
    email: 'contact2@depuy.com',
  },
]
const todaysDate = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
}).format(new Date())

const emptyCurrentRfpDefault = {
  presentationId: '',
  date: todaysDate,
  customerName: '',
  contact: JSON.stringify(SAMPLE_CONTACTS),
  customerProblem: '',
  stakeholders: null,
  discoveries: null,
  contract: {
    gpoAffilation: '',
    numberAndName: '',
    endDate: '',
    notes: '',
    priceAvailable: false,
  },
  slideSelection: defaultPresentationConfig,
  links: [],
  slides: overviewSlides,
}

// const createdRfp = {
//   presentationId: 4,
//   date: 'Feb 28 2021',
//   createdDate: 'Feb 28 2021',
//   customerName: 'New Customer',
//   contact: JSON.stringify(SAMPLE_CONTACTS),
// }

const updatedRfp = {
  presentationId: 3,
  date: 'Feb 14 2021',
  createdDate: 'Feb 14 2021',
  customerName: 'St. Peter Hospital',
  contact: JSON.stringify(SAMPLE_CONTACTS),
  discovery: null,
  stakeholders: null,
  contract: null,
  slideSelection: JSON.stringify(defaultPresentationConfig),
  slides: overviewSlides,
}

// const shareRfpPayload = {
//   presentationId: 3,
//   internalUserDetails: [
//     {
//       email: 'share@gmail.com',
//       firstName: 'Shared 1',
//       lastName: 'SharedLastname',
//       role: 'EDITOR',
//     },
//   ],
// }
// const myrfps = [
//   {
//     presentationId: 1,
//     date: 'Jan 2 2021',
//     createdDate: 'Jan 2 2021',
//     customerName: 'Mercy Hospital',
//     sharedWith: [],
//     contact: JSON.stringify(SAMPLE_CONTACTS),
//     customerProblem: '',
//     stakeholders: null,
//     discoveries: null,
//     discovery: null,
//     links: [],
//     slides: overviewSlides,
//     slideSelection: null,
//     contract: null,
//   },
//   {
//     presentationId: 3,
//     date: 'Feb 14 2021',
//     createdDate: 'Feb 14 2021',
//     customerName: 'St Peter Hospital',
//     sharedWith: [],
//     contact: JSON.stringify(SAMPLE_CONTACTS),
//     contract: null,
//     customerProblem: '',
//     stakeholders: null,
//     discoveries: null,
//     links: [],
//     slides: overviewSlides,
//     presentationVersions: {
//       update_PRESENTATION: 1,
//     },
//     internalUserDetails: [
//       {
//         email: 'peter@gmail.com',
//         firstName: 'Peter 1',
//         lastName: 'Lastname',
//         role: 'EDITOR',
//         internalUserId: 1,
//       },
//     ],
//   },
// ]

const updatedSlideContent = {
  presentationId: 'dc882f1b-1448-4e5b-8276-1d1ecfdaa200',
  prePopulatedSlide: 'APDX2',
  slideContent: 'UpdatedSlideContent',
  customSlideType: 'customSlideType',
  slideType: 'DYNAMIC',
  version: 1,
}

function getEmptyCurrentRfpDefault() {
  return {
    ...emptyCurrentRfpDefault,
  }
}

function getCreatedRfp() {
  return JSON.parse(JSON.stringify(sampleCreatedRfp))
}

function getUpdatedRfp() {
  return JSON.parse(JSON.stringify(updatedRfp))
}

function getShareRfpPayload() {
  return JSON.parse(JSON.stringify(sampleCreatedRfp))
}

function getMyRfps() {
  return JSON.parse(JSON.stringify(sampleMyRfps))
}

function getUpdatedSlideContent() {
  return JSON.parse(JSON.stringify(updatedSlideContent))
}

export {
  getEmptyCurrentRfpDefault,
  getCreatedRfp,
  getUpdatedRfp,
  getShareRfpPayload,
  getMyRfps,
  getUpdatedSlideContent,
}
