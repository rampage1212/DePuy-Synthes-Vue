/*eslint-env node, jest, amd*/
import store from './setupStore.js'

import { signin, signout } from '@/api/httpClient'

import { getAuthenticationResult } from '../../__data__/auth/authData'

jest.mock('@/api/httpClient')

describe('auth store module tests', () => {
  afterEach(() => {
    store.commit('auth/resetState')
  })

  it('should get default status', () => {
    const defaultStatus = store.getters['auth/status']
    expect(defaultStatus).toEqual('')
  })
  it('should get default authResponse', () => {
    const defaultAuthResponse = store.getters['auth/authResponse']
    expect(defaultAuthResponse).toEqual({})
  })
  it('should signin successfully', async () => {
    const payload = {
      username: 'demo',
      password: 'pass',
    }
    await store.dispatch('auth/signIn', payload)
    expect(signin).toBeCalledWith(payload.username, payload.password)
    const authResp = store.getters['auth/authResponse']
    expect(authResp).toEqual(getAuthenticationResult())
  })
  it('should signout successfully', async () => {
    const payload = {
      username: 'demo',
      password: 'pass',
    }
    await store.dispatch('auth/signIn', payload)
    const authResp = store.getters['auth/authResponse']
    expect(authResp).toEqual(getAuthenticationResult())

    await store.dispatch('auth/signout')
    expect(signout).toBeCalled()
    const authRespAfterLogout = store.getters['auth/authResponse']
    expect(authRespAfterLogout).toEqual({})
  })
})
