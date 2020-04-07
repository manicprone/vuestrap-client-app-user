import User from '../models/User'

export default {

  // Global HTTP service settings...
  api: {
    baseURL: 'http://localhost:3003',
    prefixURI: '/api/v1',
    contentType: 'application/json',
    postForUpdate: true,
    debug: false,
    auth: {
      scheme: 'custom-header',
      tokenGetter: 'auth/authToken',
      tokenHeaderName: 'x-auth-token',
    },
  },

  // User settings...
  user: {
    model: User,
    idField: 'id',
    externalIdField: 'external_id',
    endpoints: {
      fetch: '/user',
      // fetch: { uri: '/user', params: { with: 'profile' } },
      create: '/user',
      update: '/user/:id',
      // update: { uri: '/user/:id', params: { with: 'profile' } },
    },
  },

  // User Preference settings...
  userPrefs: {
    i18n: {
      locale: 'en-GB',
    },
  },

}
