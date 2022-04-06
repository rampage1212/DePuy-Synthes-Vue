/*eslint-env node, jest, amd*/
import { Auth } from 'aws-amplify'
import { Storage } from '@aws-amplify/storage'

Auth.signIn = jest.fn(() => Promise.resolve({ data: {} }))

const user = {
  attributes: '',
  Username: 'Demo User',
}
Auth.currentAuthenticatedUser = jest.fn(() => Promise.resolve(user))

const userInfo = {
  id: 'userID1',
  username: 'Demo User',
}
Auth.currentUserInfo = jest.fn(() => Promise.resolve(userInfo))

Storage.get = jest.fn(() => {})
Storage.put = jest.fn(() => {})

module.exports = { Auth, Storage }
