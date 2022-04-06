import { Auth } from '@aws-amplify/auth'
import { API } from '@aws-amplify/api'
import { Storage } from '@aws-amplify/storage'
import { Amplify } from '@aws-amplify/core'
import apiConstantsGetter from './apiConstants'

const API_NAME = 'MyAPIGatewayAPI'
const AWS_REGION = import.meta.env.VITE_COGNITO_REGION || 'us-east-1'

const apiConstants = apiConstantsGetter(import.meta.env.VITE_STAGE)

const token = async () => {
  try {
    return (await Auth.currentSession()).getAccessToken().getJwtToken()
  } catch (e) {
    return undefined
  }
}

const AWS_EXPORTS = {
  // OPTIONAL - if your API requires authentication
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId:
      import.meta.env.VITE_IDENTITY_POOL_ID ||
      apiConstants.VITE_IDENTITY_POOL_ID,
    // REQUIRED - Amazon Cognito Region
    region: AWS_REGION,
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId:
      import.meta.env.VITE_USER_POOL_ID || apiConstants.VITE_USER_POOL_ID,
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId:
      import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID ||
      apiConstants.VITE_USER_POOL_WEB_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: API_NAME,
        endpoint: import.meta.env.VITE_API_ENDPOINT || '/api',
        custom_header: async () => {
          return {
            Authorization: `Bearer ${await token()}`,
          }
        },
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_S3_BUCKET || apiConstants.VITE_S3_BUCKET,
      region: AWS_REGION,
      customPrefix: {
        public: '',
        private: '',
      },
    },
  },
}

Amplify.configure(AWS_EXPORTS)

// REST
async function get(path, params = {}, apiName = API_NAME, retries = 3) {
  try {
    return await API.get(apiName, path, {
      // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: params,
    })
  } catch (err) {
    if (retries > 1 && err.response?.status === 504)
      return await get(path, params, apiName, retries - 1)
    else
      throw {
        status: err.response?.status,
        message: err.response?.data?.message || err.message || err,
      }
  }
}

async function getByToken(
  path,
  token,
  params = {},
  apiName = API_NAME,
  retries = 3,
) {
  try {
    return await API.get(apiName, path, {
      // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: params,
      headers: {
        PDF_CLIENT_KEY: token,
      },
    })
  } catch (err) {
    if (retries > 1 && err.response?.status === 504)
      return await get(path, params, apiName, retries - 1)
    else
      throw {
        status: err.response?.status,
        message: err.response?.data?.message || err.message || err,
      }
  }
}

async function del(
  path,
  payload = {},
  headers = {},
  apiName = API_NAME,
  retries = 3,
) {
  try {
    return await API.del(apiName, path, {
      queryStringParameters: payload,
      headers: {
        presentationId: payload.presentationId || headers.presentationId,
        templateId: payload.templateId || headers.templateId,
      },
    })
  } catch (err) {
    if (retries > 1 && err.response?.status === 504)
      return await del(path, payload, headers, apiName, retries - 1)
    else
      throw {
        status: err.response?.status,
        message: err.response?.data?.message || err.message || err,
      }
  }
}

async function post(path, payload, apiName = API_NAME, retries = 3) {
  try {
    return await API.post(apiName, path, {
      body: payload,
      headers: {
        presentationId: payload.presentationId,
        templateId: payload.templateId,
      },
    })
  } catch (err) {
    if (retries > 1 && err.response?.status === 504)
      return await post(path, payload, apiName, retries - 1)
    else
      throw {
        status: err.response?.status,
        message: err.response?.data?.message || err.message || err,
      }
  }
}

async function put(path, payload, apiName = API_NAME, retries = 3) {
  try {
    return await API.put(apiName, path, {
      body: payload,
      headers: {
        presentationId: payload?.presentationId,
        templateId: payload?.templateId,
      },
    })
  } catch (err) {
    if (retries > 1 && err.response?.status === 504)
      return await put(path, payload, apiName, retries - 1)
    else
      throw {
        status: err.response?.status,
        message: err.response?.data?.message || err.message || err,
      }
  }
}

// AUTH
const signin = async (username, password) =>
  await Auth.signIn(username, password)

const signout = async () => await Auth.signOut()

const completeNewPassword = async (user, newPassowrd) =>
  await Auth.completeNewPassword(user, newPassowrd)
// Send confirmation code to user's email
const forgotPassword = async (username) => await Auth.forgotPassword(username)

// Collect confirmation code and new password, then
const forgotPasswordSubmit = async (username, code, new_password) =>
  await Auth.forgotPasswordSubmit(username, code, new_password)

const currentAuthenticatedUser = async () =>
  await Auth.currentAuthenticatedUser()

const changepassword = async (user, oldPassword, newPassword) =>
  await Auth.changePassword(user, oldPassword, newPassword)

async function getFile(fileName, directory = '', download = false) {
  return await Storage.get(`${directory}${fileName}`, {
    level: 'public',
    download,
  })
}

async function saveFile(file, fileName, directory = '', contentType) {
  return await Storage.put(`${directory}${fileName}`, file, {
    level: 'public',
    contentType,
  })
}

async function deleteFile(fileName, directory = '') {
  return await Storage.remove(`${directory}${fileName}`, {
    level: 'public',
  })
}

export {
  // REST
  get,
  getByToken,
  post,
  put,
  del,
  // auth
  signin,
  signout,
  completeNewPassword,
  forgotPassword,
  forgotPasswordSubmit,
  currentAuthenticatedUser,
  changepassword,
  Auth,
  getFile,
  saveFile,
  deleteFile,
}
