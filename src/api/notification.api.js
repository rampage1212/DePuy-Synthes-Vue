import { get, put } from './httpClient.js'

const path = '/notification'

const getNotificationByUser = (userId) => get(`${path}/user/${userId}`)

const markAsViewed = (notificationIds) =>
  put(`${path}/mark-viewed`, { notificationIds })

export { getNotificationByUser, markAsViewed }
