/*eslint-env node, jest, amd*/
// AUTH
import { getAuthenticationResult } from '../../../tests/__data__/auth/authData'
const signin = jest.fn(() => Promise.resolve(getAuthenticationResult()))

const signout = jest.fn(() => Promise.resolve())

export {
  // auth
  signin,
  signout,
}
