/*eslint-env node, jest, amd*/
import store from './setupStore.js'

import { getNotificationByUser, markAsViewed } from '@/api/notification.api'
import { mockUserDetail } from '../../__data__/auth/authData.js'
import { getNotificationByUserData } from '../../__data__/notification/getNotificationData'

jest.mock('@/api/notification.api')
jest.mock('@/api/user.api')

describe('notification store module tests', () => {
  afterEach(() => {
    store.commit('notification/setNotifications', [])
  })

  it('should get initial notifications values', () => {
    const defaultStatus = store.getters['notification/notifications']
    expect(defaultStatus).toEqual([])
  })

  it('should get initial notificationLength values', () => {
    const defaultStatus = store.getters['notification/notificationLength']
    expect(defaultStatus).toEqual(0)
  })

  it('should fetchNotifications', async () => {
    await store.dispatch('notification/fetchNotifications')
    expect(getNotificationByUser).toBeCalledWith(mockUserDetail.id)
    const notifications = store.getters['notification/notifications']
    const expected = getNotificationByUserData()
      .map((notification) => ({
        id: notification.notificationId,
        title: notification.subject,
        isViewed: notification.isViewed,
        time: new Date(notification.createdDate),
        detail: notification.body,
        type: notification.notificationType,
        url:
          notification.notificationType === 'RFP'
            ? {
                name: 'update-presentation',
                params: { presentationId: notification.id, step: 1 },
              }
            : ``,
        userId: notification.userAwsId,
      }))
      .sort((notif1, notif2) => notif2.time - notif1.time)

    expect(notifications).toEqual(expected)
  })
  it('should clearAll all notifications as viewed', async () => {
    await store.dispatch('notification/fetchNotifications')
    const notificationLength = store.getters['notification/notificationLength']

    const mockNotification = getNotificationByUserData()
    expect(notificationLength).toEqual(mockNotification.length)

    mockNotification.forEach((n) => {
      n.isViewed = true
    })
    getNotificationByUser.mockImplementationOnce(() =>
      Promise.resolve(mockNotification),
    )
    await store.dispatch('notification/clearAll')

    expect(getNotificationByUser).toBeCalledWith(mockUserDetail.id)
    const notificationLengthAfter =
      store.getters['notification/notificationLength']
    expect(notificationLengthAfter).toEqual(0)
  })
  it('should mark notifications As Viewed ', async () => {
    await store.dispatch('notification/fetchNotifications')
    const notificationId = '11f526b3-9491-4ef8-942b-2d9798b64ec2'
    const ids = [notificationId]

    const mockNotification = getNotificationByUserData()
    const noti = mockNotification.find(
      (f) => f.notificationId === notificationId,
    )
    noti.isViewed = true
    getNotificationByUser.mockImplementationOnce(() =>
      Promise.resolve(mockNotification),
    )

    // todo: test that notification was not viewed, then changes to be viewed. The mock api may need to be updated
    // todo: expect(notification.isViewed).toEqual(false)
    await store.dispatch('notification/markAsViewed', ids)
    expect(markAsViewed).toBeCalledWith(ids)

    expect(getNotificationByUser).toBeCalledWith(mockUserDetail.id)
    const notifications = store.getters['notification/notifications']
    const notification = notifications.find((f) => f.id === notificationId)
    expect(notification.isViewed).toEqual(true)
  })
})
