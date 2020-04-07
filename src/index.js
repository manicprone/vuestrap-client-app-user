import { generateStore } from './store/user'
import ExternalUserProfileEditor from './components/ExternalUserProfileEditor.vue'
import LanguagePicker from './components/LanguagePicker.vue'
import LocalUserProfileEditor from './components/LocalUserProfileEditor.vue'
import ProfileEditorFeedback from './components/ProfileEditorFeedback.vue'
import UserAvatar from './components/UserAvatar.vue'
import UserMenu from './components/UserMenu.vue'

const pluginName = 'client-app-user'
const defaultNamespace = 'user'
const componentNameExternalUserProfileEditor = 'external-user-profile-editor'
const componentNameLanguagePicker = 'language-picker'
const componentNameLocalUserProfileEditor = 'local-user-profile-editor'
const componentNameProfileEditorFeedback = 'profile-editor-feedback'
const componentNameUserAvatar = 'user-avatar'
const componentNameUserMenu = 'user-menu'

export default function install(Vue, options = {}) {
  // Parse options...
  const logInit = options.logInit && options.logInit === true
  const debug = options.debug && options.debug === true
  const debugInit = options.debugInit && options.debugInit === true
  const debugRequests = options.debugRequests && options.debugRequests === true
  const debugNormalizer = options.debugNormalizer && options.debugNormalizer === true
  const namespace = options.namespace || defaultNamespace
  const syncMode = options.syncMode && options.syncMode === true
  const apiSettings = options.api || {}
  const userSettings = options.user || {}
  const userProfileSettings = options.userProfile
  const userPrefsSettings = options.userPrefs
  const hydrateUserOn = options.hydrateUserOn
  const clearUserOn = options.clearUserOn
  const initSettings = { apiSettings, userSettings, userProfileSettings, userPrefsSettings }

  if (logInit) console.log(`Vue is being bootstrapped with "${pluginName}"`)

  // Bootstrap vuex with app user management...
  if (options.store) {
    const userStore = generateStore({
      debug,
      debugInit,
      debugRequests,
      debugNormalizer,
      pluginName,
      syncMode,
      initSettings,
    })
    options.store.registerModule(namespace, userStore)

    // Attach store subscriptions...
    if (hydrateUserOn || clearUserOn) {
      const hydrateUserTrigger = hydrateUserOn || '_'
      const clearUserTrigger = clearUserOn || '_'
      options.store.subscribe(({ type, payload }) => {
        switch (type) {
          case hydrateUserTrigger:
            if (debug) console.log(`[${pluginName}] Triggered hydrate user on:`, hydrateUserTrigger)
            options.store.dispatch('user/hydrateUser', payload)
            break
          case clearUserTrigger:
            if (debug) console.log(`[${pluginName}] Triggered clear user on:`, clearUserTrigger)
            options.store.dispatch('user/clearActiveUser', payload)
            break
        }
      })
    }
  } // end-if (options.store)

  // Register components...
  Vue.component(componentNameExternalUserProfileEditor, ExternalUserProfileEditor)
  Vue.component(componentNameLanguagePicker, LanguagePicker)
  Vue.component(componentNameLocalUserProfileEditor, LocalUserProfileEditor)
  Vue.component(componentNameProfileEditorFeedback, ProfileEditorFeedback)
  Vue.component(componentNameUserAvatar, UserAvatar)
  Vue.component(componentNameUserMenu, UserMenu)
}
