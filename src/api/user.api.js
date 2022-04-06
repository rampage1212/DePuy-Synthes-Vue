import { get, post, put } from './httpClient.js'

const userEndpoint = '/user'

const getUser = async (email, userID) =>
  await get(`${userEndpoint}?email=${email}&user-id=${userID}`)

const createUser = async (payload) => await post(userEndpoint, payload)

const updateUser = async (payload) => await put(userEndpoint, payload)

export { getUser, createUser, updateUser }
