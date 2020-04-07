import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import MockAuthenticator from 'authenticator-client-mock-js'
import ClientAuthSupport from 'vuestrap-client-auth-support'
import ClientAppConfig from 'vuestrap-client-app-config'
import ClientAppUser from '../../dist/plugin'
import { createStore } from '../test-app-helpers'
import { createRouter } from './routers/simple-public-private'
import App from './pages/App.vue'
import appConfig from './config/app-config'
import userConfig from './config/user-config-projects'

Vue.config.productionTip = false

// Create store and router instances, sync router with the store...
const store = createStore()
const router = createRouter()
sync(store, router)

// Bootstrap with app config support...
Vue.use(ClientAppConfig, {
  logInit: true,
  store,
  config: {
    name: appConfig.name,
    alias: appConfig.alias,
    platform: appConfig.platform,
  },
  settings: appConfig.settings,
})

// Bootstrap with client auth support...
Vue.use(ClientAuthSupport, {
  logInit: true,
  debug: true,
  store,
  router,
  authenticator: new MockAuthenticator({ ttl: 10 * 60 * 1000, uuidMode: true }),
  tokenName: 'auth-token',
  persistType: 'local',
  directUnAuthedTo: 'home',
  includeUserInfo: true,
})

// Bootstrap with client app user support...
Vue.use(ClientAppUser, {
  logInit: true,
  debugInit: true,
  debug: true,
  debugRequests: true,
  debugNormalizer: false,
  store,
  syncMode: true,
  api: userConfig.api,
  user: userConfig.user,
  hydrateUserOn: 'auth/setUserInfo', // default is a mutation
  clearUserOn: 'auth/clearSession',
  // hydrateUserOn: 'action:auth/loginUser',
  // hydrateUserOn: 'mutation:auth/setUserInfo',
})

// Instantiate root Vue instance...
const app = new Vue({
  router,
  store,
  render: h => h(App),
})

// Mount to DOM...
app.$mount('#app')
