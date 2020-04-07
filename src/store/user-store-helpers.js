import objectUtils from '../utils/object-utils'


// ----------------------------------------------------- Init / Processing Logic

export function processResourceConfig(resourceConfig = {}) {
  const config = Object.assign({}, objectUtils.cloneDeep(resourceConfig))
  // Normalize endpoint config...
  if (config.endpoints) {
    config.endpoints = objectUtils.mapValues(config.endpoints, (value) => {
      if (typeof value === 'string') return { uri: value, params: {} }
      return value
    })
  }
  return config
}

// -------------------------------------------------------- HTTP Request Actions

export function prepareFetchUserByExternalIdRequest(externalID, storeContext = {}, settings = {}) {
  if (!externalID) return null
  const apiSettings = settings.apiSettings
  const userSettings = settings.userSettings
  const externalIdField = userSettings.externalIdField

  // Build request URI...
  const fetchURI = objectUtils.get(userSettings, 'endpoints.fetch.uri', '')
  const uri = `${apiSettings.prefixURI}${fetchURI.replace(':id', externalID)}`

  // Build headers and query...
  const authRequest = prepareAuthRequest(storeContext, { apiSettings, resourceConfig: userSettings })
  const fetchParams = objectUtils.get(userSettings, 'endpoints.fetch.params', {})
  const query = Object.assign({}, fetchParams)
  if (externalIdField) query[externalIdField] = externalID // include external ID on query (in case not part of uri)

  const opts = Object.assign({}, authRequest, { query })
  return { uri, options: opts }
}

export function prepareCreateUserRequest(userData, storeContext = {}, settings = {}) {
  if (!userData) return null
  const apiSettings = settings.apiSettings
  const userSettings = settings.userSettings

  // Build request URI...
  const createURI = objectUtils.get(userSettings, 'endpoints.create.uri', '')
  const uri = `${apiSettings.prefixURI}${createURI}`

  // Build headers, body, and query...
  const authRequest = prepareAuthRequest(storeContext, { apiSettings, resourceConfig: userSettings })
  const createParams = objectUtils.get(userSettings, 'endpoints.create.params', {})
  const query = Object.assign({}, createParams)
  const body = Object.assign({}, serializeItemData(userData))

  const opts = Object.assign({}, authRequest, { body, query })
  return { uri, options: opts }
}

// -------------------------------------------------- HTTP Request Builder Logic

// returns => { headers }
export function prepareAuthRequest(storeContext = {}, settings = {}) {
  const request = {}

  const globalApiSettings = settings.apiSettings || {}
  const resourceConfig = settings.resourceConfig
  const overrideApiSettings = resourceConfig.api
  const authSettings = (overrideApiSettings && overrideApiSettings.auth && overrideApiSettings.auth.scheme)
    ? overrideApiSettings.auth
    : globalApiSettings.auth

  // Handle enabled auth scheme...
  const authScheme = objectUtils.get(authSettings, 'scheme', null)
  if (authScheme) {
    const authToken = (authSettings.tokenGetter) ? storeContext.rootGetters[authSettings.tokenGetter] : {}
    const headerName = authSettings.tokenHeaderName || 'x-token'
    switch (authScheme) {
      case 'bearer-token': {
        request.headers = { Authorization: `Bearer ${authToken}` }
        break
      }
      case 'custom-header': {
        request.headers = {}
        request.headers[headerName] = authToken
        break
      }
      default: request.headers = {}
    }
  } // end-if (authScheme)

  return request
}

export function serializeItemData(data) {
  return objectUtils.mapValues(data, (value) => {
    if (typeof value === 'boolean') return String(value)
    return value
  })
}
