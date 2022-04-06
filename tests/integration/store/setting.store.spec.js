/*eslint-env node, jest, amd*/
/*eslint-disable no-import-assign*/
import store, { gaEvent } from './setupStore.js'
import { Auth as mockAuth } from '../../__mocks__/auth_aws-amplify_mock.js'
import { getUser, createUser, updateUser } from '@/api/user.api'
import {
  mockUserDetail,
  defaultUser,
  defaultEmailBody,
} from '../../__data__/auth/authData.js'

jest.mock('@/api/user.api')

describe('store setting module spec', () => {
  it('should get and set correct email body', () => {
    const emailBody = store.getters['setting/emailBody']
    expect(emailBody).toBe('')

    const updatedEmailBody = 'Updated Email Body'
    store.commit('setting/setEmailBody', updatedEmailBody)
    const currentEmailBody = store.getters['setting/emailBody']
    expect(currentEmailBody).toBe(updatedEmailBody)
  })

  it('should fetch user', async () => {
    const result = await store.dispatch('setting/fetchUser')
    expect(result).toEqual(expect.objectContaining(defaultUser))
    expect(getUser).toBeCalled()
    expect(getUser.mock.calls[0][1]).toEqual(defaultUser.id)
    expect(gaEvent).toBeCalledWith({
      action: 'fetch-user',
      event_category: 'settting',
      event_label: 'User-fetch-user',
    })

    const settingsGetterValues = {
      id: store.getters['setting/userId'],
      firstName: store.getters['setting/getFirstName'],
      lastName: store.getters['setting/getLastName'],
      emailBody: store.getters['setting/emailBody'],
    }

    expect(settingsGetterValues).toMatchObject({
      ...mockUserDetail,
      emailBody:
        mockUserDetail.emailBody || defaultEmailBody(settingsGetterValues),
    })
  })

  it('should create user if fetch user fails', async () => {
    const _404Error = {
      status: 404,
    }

    mockAuth.currentAuthenticatedUser.mockImplementationOnce(() => {
      throw _404Error
    })

    await store.dispatch('setting/fetchUser')

    expect(createUser).toBeCalled()

    expect(createUser.mock.calls[0][0]).toMatchObject({
      userId: mockUserDetail.id,
      firstName: mockUserDetail.firstName,
      lastName: mockUserDetail.lastName,
      emailBody: mockUserDetail.emailBody || defaultEmailBody(mockUserDetail),
    })

    const settingsGetterValues = {
      id: store.getters['setting/userId'],
      firstName: store.getters['setting/getFirstName'],
      lastName: store.getters['setting/getLastName'],
      emailBody: store.getters['setting/emailBody'],
    }

    expect(settingsGetterValues).toMatchObject({
      ...mockUserDetail,
      emailBody:
        mockUserDetail.emailBody || defaultEmailBody(settingsGetterValues),
    })
  })

  it('should update user', async () => {
    const emailBody = 'Dummy Email Body'
    const result = await store.dispatch('setting/updateUser', {
      emailBody: emailBody,
    })

    expect(result).toEqual(
      expect.objectContaining({ ...defaultUser, emailBody }),
    )
    expect(updateUser).toBeCalled()

    const settingsGetterValues = {
      id: store.getters['setting/userId'],
      firstName: store.getters['setting/getFirstName'],
      lastName: store.getters['setting/getLastName'],
      emailBody: store.getters['setting/emailBody'],
    }

    expect(settingsGetterValues).toMatchObject({ ...mockUserDetail, emailBody })

    expect(gaEvent).toBeCalledWith({
      action: 'update-user',
      event_category: 'settting',
      event_label: 'User-update-user',
    })
  })
})
