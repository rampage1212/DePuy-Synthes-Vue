/*eslint-env node, jest, amd*/
import { mockUserDetail } from '../../../tests/__data__/auth/authData.js'

const getUser = jest.fn(() => Promise.resolve(mockUserDetail))

const createUser = jest.fn((userToCreate) =>
  Promise.resolve({ ...mockUserDetail, ...userToCreate }),
)

const updateUser = jest.fn((userToUpdate) =>
  Promise.resolve({ ...mockUserDetail, ...userToUpdate }),
)

export { getUser, createUser, updateUser }
