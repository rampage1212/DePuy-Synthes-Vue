import { defaultEmailBody } from '@/data/defaultSetting.js'
import authenticationResult from './authenticationResult.json'
import mockUserDetail from './userDetail.json'

function getAuthenticationResult() {
  JSON.parse(JSON.stringify(authenticationResult))
}

const defaultUser = {
  ...mockUserDetail,
  emailBody: defaultEmailBody(mockUserDetail),
}

export {
  getAuthenticationResult,
  mockUserDetail,
  defaultUser,
  defaultEmailBody,
}
