import AjaxService from '../services/Ajax'
// import AppMessage from '../models/AppMessage';
import AnonUser from '../models/AnonUser'
import * as StoreHelpers from './user-store-helpers'

const JointNormalizer = require('joint-normalizer')

const defaultAPISettings = {
  baseURL: '',
  prefixURI: '',
  contentType: 'application/json',
  assocNameMap: {},
}

const defaultUserSettings = {
}

const defaultUserProfileSettings = {
}

const defaultUserPrefsSettings = {
}

const defaultUserPrefs = {
  i18n: {
    locale: 'en-GB',
  },
}

export function generateStore(initOptions) {
  const debugInit = initOptions.debugInit
  const debugHydrate = initOptions.debug
  const debugSync = initOptions.debug
  const debugRequests = initOptions.debugRequests
  const debugNormalizer = initOptions.debugNormalizer

  const pluginName = initOptions.pluginName
  const syncMode = initOptions.syncMode
  const initSettings = initOptions.initSettings

  const logInitHeader = `Loading Vuestrap: ${pluginName}`
  const logHeaderLine = '===================================='
  if (debugInit) {
    console.log(logHeaderLine)
    console.log(logInitHeader)
    console.log(logHeaderLine)
    console.log(`[${pluginName}] Initializing store with settings =>`, initSettings)
    if (syncMode) console.log(`[${pluginName}] External User (Sync) mode enabled`)
  }

  // Prepare global api settings...
  const loadedAPISettings = Object.assign({}, defaultAPISettings, initSettings.apiSettings)

  // Prepare resource settings (user, userProfile, userPrefs)...
  const loadedUserSettings = Object.assign({}, defaultUserSettings, StoreHelpers.processResourceConfig(initSettings.userSettings))
  const loadedUserProfileSettings = (initSettings.userProfileSettings) ? Object.assign({}, defaultUserProfileSettings, initSettings.userProfileSettings) : null
  const loadedUserPrefsSettings = (initSettings.userPrefsSettings) ? Object.assign({}, defaultUserPrefsSettings, initSettings.userPrefsSettings) : null

  // Collect registered models...
  const registeredModels = {}
  if (loadedUserSettings.model) registeredModels['User'] = loadedUserSettings.model
  if (loadedUserProfileSettings && loadedUserProfileSettings.model) registeredModels['UserProfile'] = loadedUserProfileSettings.model
  if (loadedUserPrefsSettings && loadedUserPrefsSettings.model) registeredModels['UserPrefs'] = loadedUserPrefsSettings.model

  // Instantiate HTTP service...
  const baseURL = loadedAPISettings.baseURL || ''
  const contentType = loadedAPISettings.contentType || null
  const ajaxOptions = {
    baseURL,
    debug: debugRequests,
    logNamespace: `[${pluginName}-xhr]`,
  }
  if (loadedAPISettings.timeout) ajaxOptions.timeout = loadedAPISettings.timeout
  if (contentType) ajaxOptions.headers = { 'Content-Type': contentType, Accept: contentType }
  const API = new AjaxService(ajaxOptions)

  // Initialize normalizer (with model factory)...
  const normalizer = new JointNormalizer({
    payloadSpec: 'json-api',
    models: registeredModels,
    debugInit,
    debug: debugNormalizer,
    debugToModel: debugNormalizer,
    logNamespace: `[${pluginName}-normalizer]`,
    relationNameMap: loadedAPISettings.assocNameMap,
  })
  const toModel = payload => normalizer.normalizePayload(payload, true)

  // ---------------------------------------------------------------------------
  // Build store state
  // ---------------------------------------------------------------------------
  const userStore = { namespaced: true }
  userStore.state = {
    // ---------------------------------------------------- Plugin configuration
    pluginName,
    syncMode,
    apiSettings: loadedAPISettings,
    userSettings: loadedUserSettings,
    userProfileSettings: loadedUserProfileSettings,
    userPrefsSettings: loadedUserPrefsSettings,

    // ----------------------------------------------------- The active app user
    user: new AnonUser(),
    userProfileEditing_messages: [],        // the queue of messages for user profile edits
    userProfileEditing_activeMessage: null, // the active user profile message to be handled

    // --------------------------------------------- The active user preferences
    defaultUserPrefs,
    userPrefs: defaultUserPrefs,
  } // END - state

  // ---------------------------------------------------------------------------
  // Build store getters
  // ---------------------------------------------------------------------------
  userStore.getters = {
    // ------------------------------------------------------ Plugin config data

    pluginName(state) {
      return state.pluginName
    },

    syncMode(state) {
      return state.syncMode
    },

    // ------------------------------------------------------------- Active user

    activeUser(state) {
      return state.user
    },

    userProfileEditingFeedback(state) {
      return state.userProfileEditing_activeMessage
    },

    // ------------------------------------------------------- Active user prefs

    defaultUserPrefs(state) {
      return state.defaultUserPrefs
    },

    activeUserPrefs(state) {
      return state.userPrefs
    },

    activeLocale(state) {
      return state.userPrefs.i18n.locale
    },
  } // END - getters

  // ---------------------------------------------------------------------------
  // Build store actions
  // ---------------------------------------------------------------------------
  userStore.actions = {
    // ----------------------------------------------- Hydrate user core actions

    hydrateUser(context, userInfo) {
      const { dispatch, getters } = context
      const isSyncMode = getters.syncMode

      // If we already have an authenticated user in the state, no need to do anything...
      const activeUser = getters.activeUser
      if (activeUser.is_logged_in) return activeUser

      // If no session info exists, hydrate into the anonymous app user...
      if (!userInfo) {
        if (debugHydrate) console.log(`[${pluginName}] Hydrating anonymous app user (no session found)`)
        return dispatch('clearActiveUser').then(() => getters.activeUser)
      }

      // Otherwise, hydrate into the authenticated app user...
      if (!isSyncMode) return dispatch('hydrateLocalUser', userInfo) // local user mode
      return dispatch('hydrateExternalUser', userInfo) // external user (sync) mode
    },

    setActiveUser(context, user) {
      context.commit('setActiveUser', user)
    },

    clearActiveUser(context) {
      context.commit('clearActiveUser')
    },

    // --------------------------------------------------- Local user management

    hydrateLocalUser(context, localUserInfo = {}) {
      const { dispatch } = context

      if (debugHydrate) {
        console.log(`[${pluginName}] Hydrating app user with session info =>`)
        console.log(localUserInfo)
      }

      const user = new registeredModels['User'](localUserInfo)
      user.is_logged_in = true
      dispatch('setActiveUser', user)
      if (debugHydrate) {
        console.log(`[${pluginName}] App user hydrated =>`)
        console.log(user)
      }
      return user
    },

    // ------------------------------------------------ External user management

    hydrateExternalUser(context, externalUserInfo = {}) {
      const { dispatch, getters } = context

      if (debugHydrate) {
        console.log(`[${pluginName}] Hydrating app user with external user info =>`)
        console.log(externalUserInfo)
      }

      return dispatch('fetchUserByExternalInfo', externalUserInfo)
        .then((existingUser) => {
          // -----------------------------------------------------------------
          // This is a return user: sync any changes, then update the store...
          // -----------------------------------------------------------------
          if (debugSync) console.log(`[${pluginName}] A synced user account was found`)

          // Sync any updates on the user info...
          // const diffs = diffUserInfo(existingUser, parseExternalInfo(externalUserInfo));
          // if (diffs !== null) {
          //   return syncUserInfo(existingUser, diffs, joint)
          //     .then((updatedUser) => {
          //       if (debugHydrate) {
          //         console.log('[AUTH] user account was updated =>');
          //         console.log(updatedUser);
          //       }
          //
          //       // Log-in user, update the store...
          //       return performAuthedUserLogin(updatedUser, store, context.session)
          //         .then(() => resolve(updatedUser));
          //     }); // end-syncUserInfo
          // } // end-if (diffs !== null)

          // Otherwise, if no diffs => log-in user, update the store...
          existingUser.is_logged_in = true
          dispatch('setActiveUser', existingUser)
          if (debugHydrate) {
            console.log(`[${pluginName}] App user hydrated =>`)
            console.log(existingUser)
          }
          return existingUser
        })
        .catch((result) => {
          const resultStatus = result.status

          // ----------------------------------------------------------------
          // This is a first-time login scenario: so create a user account...
          // ----------------------------------------------------------------
          if (resultStatus === 404) {
            if (debugSync) console.log(`[${pluginName}] A synced user account does not exist, so it will be created...`)

            return dispatch('createUserByExternalInfo', externalUserInfo)
              .then((newUser) => {
                if (debugSync) console.log(`[${pluginName}] A synced user account was created`)

                // Log-in the user, and update the store...
                newUser.is_logged_in = true
                dispatch('setActiveUser', newUser)
                if (debugHydrate) {
                  console.log(`[${pluginName}] External app user hydrated =>`)
                  console.log(newUser)
                }
                return newUser
              })
          } // end-if (resultStatus === 404)

          // ---------------------------------------------------
          // There was an error, so return the anonymous user...
          // ---------------------------------------------------
          if (debugSync) console.log(`[${pluginName}] There was an issue fetching the external user, so the app user will remain logged-out...`)
          const anonUser = Object.assign(getters.activeUser, { hydrate_status_code: resultStatus }) // include the status of the scenario
          dispatch('setActiveUser', anonUser)
          return anonUser
        }) // end-fetchUserByExternalInfo
    },

    fetchUserByExternalInfo(context, externalInfo = {}) {
      const { state } = context
      const apiSettings = state.apiSettings
      const userSettings = state.userSettings

      const idField = userSettings.idField || 'id'
      const externalID = externalInfo[idField]
      if (!externalID) return Promise.reject({ status: 400 })

      // Build request signature...
      const request = StoreHelpers.prepareFetchUserByExternalIdRequest(externalID, context, { apiSettings, userSettings })
      if (!request) {
        if (debugSync) console.log(`[${pluginName}] Unable to fetch synced user account, due to invalid session or data`)
        return Promise.reject({ status: 500 })
      }
      if (debugSync) console.log(`[${pluginName}] Fetching synced user account via ${request.uri}`, request.options)

      return API.get(request.uri, request.options)
        .then((payload) => {
          return toModel(payload)
        })
        .catch((error) => {
          if (error.status === 404) return Promise.reject({ status: 404 })
          if (debugSync && error.status !== 404) {
            console.log(`[${pluginName}] fetchUserByExternalInfo =>`)
            console.log(error)
          }
          return Promise.reject({ status: error.status || 500 })
        })
    },

    createUserByExternalInfo(context, externalInfo = {}) {
      const { state } = context
      const apiSettings = state.apiSettings
      const userSettings = state.userSettings
      const userData = parseExternalUserInfo(externalInfo, userSettings)

      // Build request signature...
      const request = StoreHelpers.prepareCreateUserRequest(userData, context, { apiSettings, userSettings })
      if (!request) {
        if (debugSync) console.log(`[${pluginName}] Unable to create synced user account, due to invalid session or data`)
        return Promise.reject(false)
      }
      if (debugSync) console.log(`[${pluginName}] Creating synced account via ${request.uri}`, request.options)

      // Create user...
      return API.post(request.uri, request.options)
        .then((payload) => {
          return toModel(payload)
        })
        // .then((user) => {
        //   const uriCreateProfile = '/api/v1/user-profile';
        //   const profileData = {
        //     user_id: user.id,
        //   };
        //   return UserAPI.post(uriCreateProfile, { body: profileData })
        //     .then((profilePayload) => {
        //       const profile = toModel(profilePayload);
        //       user.setProfile(profile); // load profile into user object
        //       return user;
        //     });
        // })
        .catch((error) => {
          if (debugSync) {
            console.log(`[${pluginName}] createUserByExternalInfo =>`)
            console.log(error)
          }
          return Promise.reject({ status: error.status || 500 })
        })
    },

    /*
    markActiveUserLogin(context) {
      const { state } = context;
      const activeUserID = state.user.id;

      const uri = `/api/v1/user/${activeUserID}/mark_login`;

      return UserAPI.post(uri)
        .then(() => true)
        .catch((error) => {
          console.error(error);
          return null;
        });
    },
    */

    /*
    updateMyUserProfile(context, profile = {}) {
      const { state, dispatch, getters, commit } = context;
      const activeUserID = state.user.id;

      if (!profile.model) return false;

      const uri = `/api/v1/user/${activeUserID}/profile`;
      const body = Object.assign({}, profile.serialize());

      return UserAPI.post(uri, { body })
        .then((payload) => {
          const updatedUserProfile = toModel(payload);

          // Load updated profile into user state...
          const user = getters.activeUser;
          user.setProfile(updatedUserProfile);
          commit('setActiveUser', user);

          // Register feedback message...
          const message = new AppMessage({
            source: updatedUserProfile,
            status_code: 200,
            severity: 'success',
          });
          dispatch('registerMessageForUserProfileEditing', message);

          return updatedUserProfile;
        });
    },
    */

    /*
    registerMessageForUserProfileEditing(context, message) {
      context.commit('registerMessageForUserProfileEditing', message);
      context.commit('advanceMessageForUserProfileEditing');
    },

    resolveMessageForUserProfileEditing(context) {
      context.commit('resolveMessageForUserProfileEditing');
      context.commit('advanceMessageForUserProfileEditing');
    },
    */

    // --------------------------------------------------- User prefs management

    /*
    loadActiveUserPrefs(context) {
      const { dispatch, commit, getters } = context;
      const defaultSettings = getters.defaultUserSettings;

      return dispatch('fetchActiveUserSettings')
        .then((userSettings) => {
          // Load persisted settings...
          const savedUserSettings = userSettings.settings || {};
          const activeUserSettings = Object.assign(defaultSettings, savedUserSettings);
          return commit('setActiveUserPrefs', activeUserSettings);
        })
        .catch(() => {
          // Just load the default settings...
          return commit('setActiveUserPrefs', defaultSettings);
        });
    },
    */

    /*
    fetchActiveUserPrefs(context) {
      const { state } = context;
      const activeUserID = state.user.id;

      const uri = `/api/v1/user/${activeUserID}/settings`;

      return UserAPI.get(uri)
        .then(payload => toModel(payload))
        .catch(() => Promise.reject(null));
    },
    */

    /*
    saveActiveUserPrefs(context) {
      const { state } = context;
      const activeUser = state.user;
      const activeUserID = activeUser.id;
      const activeUserSettings = state.settings;

      if (!activeUser.is_logged_in) return false;

      const uri = `/api/v1/user/${activeUserID}/settings`;
      const body = { settings: activeUserSettings };

      return UserAPI.post(uri, { body })
        .then(() => true);
    },

    setActiveUserPrefs(context, settings) {
      context.commit('setActiveUserPrefs', settings);
    },
    */

    // -------------------------------------------------
    // These are all of the prefs that a user can change
    // -------------------------------------------------
    /*
    setActiveLocale(context, locale) {
      const { dispatch, commit } = context;
      commit('setActiveLocale', locale); // write directly into store
      dispatch('saveActiveUserPrefs'); // persist changes
    },
    */
  } // END - actions

  // ---------------------------------------------------------------------------
  // Build store mutations
  // ---------------------------------------------------------------------------
  userStore.mutations = {
    // -------------------------------------------------------------- User state

    setActiveUser(state, user) {
      state.user = user
    },

    clearActiveUser(state) {
      // Anonymize user context...
      state.user = new AnonUser()

      // Clear out messages...
      state.userProfileEditing_messages = []
      state.userProfileEditing_activeMessage = null
    },

    // ---------------------------------------------- User profile editing state

    registerMessageForUserProfileEditing(state, message) {
      state.userProfileEditing_messages.unshift(message)
    },

    advanceMessageForUserProfileEditing(state) {
      // Advance next available message, if ready...
      if (!state.userProfileEditing_activeMessage) state.userProfileEditing_activeMessage = state.userProfileEditing_messages.pop()
    },

    resolveMessageForUserProfileEditing(state) {
      state.userProfileEditing_activeMessage = null
    },

    // -------------------------------------------------------- User prefs state

    setActiveUserPrefs(state, prefs) {
      state.userPrefs = prefs
    },

    setActiveLocale(state, locale) {
      state.userPrefs.i18n.locale = locale
    },
  } // END - mutations

  // -----------------
  // Utility functions
  // -----------------
  function parseExternalUserInfo(externalUserInfo, userSettings) {
    if (debugSync) console.log(`[${pluginName}] parsing external user info:`, externalUserInfo)

    const idField = userSettings.idField || 'id'
    const externalIdField = userSettings.externalIdField || 'external_id'
    const userID = externalUserInfo[idField]

    // Mount ID as external ID field, null out the local ID...
    const userData = Object.assign({}, externalUserInfo)
    userData[externalIdField] = userID
    userData[idField] = null
    if (debugSync) console.log(`[${pluginName}] parsed =>`, userData)

    return userData
  }

  return userStore
} // END - generateStore()
