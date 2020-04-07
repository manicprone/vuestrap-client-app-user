# Vuestrap | Client App User

App user authorization and account/profile management for Vuestack client apps (Vue + Vue-Router + Vuex).

<br />

> NOTE: This README information is out-of-date !!! It will be updated soon.

## Table of Contents

* [Introduction][section-introduction]
* [Prerequisites][section-prerequisites]
* [How to Use][section-how-to-use]
* [Namespace][section-namespace]
* [Options][section-options]
* [Models][section-models]
* [Store][section-store]
* [Components][section-components]
* [For Developers][section-for-developers]


## Introduction

### What is a Vuestrap?

A Vuestrap is a Vue plugin designed to bootstrap Vue apps with robust, fully-operational application layers.

The plugins strap themselves across the full horizontal stack of the Vue anatomy:
adding router logic, state management handling, application logic, data models, and components,
allowing you to rapidly compose powerful Vue application boilerplates.

### Client App User

The *Client App User* Vuestrap provides ...(TBC)... within a Vue client application.

[TBC - More Details]


## Prerequisites

The *Client App User* plugin requires:

* Vue2 ([github.com/vuejs/vue][link-vue-github])
* Vuex ([github.com/vuejs/vuex][link-vuex-github])


## How to Use

### Install


#### with yarn:

``` sh
$ yarn add vuestrap-client-app-user
```

#### with npm:

``` sh
$ npm install vuestrap-client-app-user --save
```

### Bootstrap Your Vue App

``` javascript
import Vue from 'vue'
import store from './store' // your vuex store instance
import ClientAppUser from 'vuestrap-client-app-user'

Vue.use(ClientAppUser, {
  debug: true,
  store,
  syncMode: true,
  api: userConfig.api,
  user: userConfig.user,
  hydrateUserOn: 'auth/setUserInfo',
  clearUserOn: 'auth/clearSession',
})
```

## Namespace

The default namespace for the Client App User store API is: `user`.

However, you can set your preferred namespace when bootstrapping, using the `namespace` option.


## Options

The following options are available when bootstrapping the app.

| Name             | Required? | Description |
| ---------------- | --------- | ----------- |
| store            | Yes       | The Vuex instance. |
| api              | Yes       | The general API settings for interacting with the remote API server. |
| user             | Yes       | [TBC] |
| userProfile      | No        | [TBC] |
| userPrefs        | No        | [TBC] |
| syncMode         | No        | Set to `true` to enable syncing of resource data into local database. (TODO: This option will be moved within each resource soon) |
| namespace        | No        | The namespace to use with the store API. By default, the namespace is `cms`. |
| hydrateUserOn    | No        | Automatically trigger user hydration, when a specified Vuex action or mutation is invoked. |
| clearDataOn      | No        | Automatically trigger the clearing of the hydrated user, when a specified Vuex action or mutation is invoked. |
| logInit          | No        | Set to `true` to log messages on bootstrapping. Defaults to `false`. |
| debugInit        | No        | Set to `true` to log debug messages on bootstrapping. Defaults to `false`. |
| debug            | No        | Set to `true` to log debug messages during utilization. Defaults to `false`. |
| debugRequests    | No        | Set to `true` to log debug messages during HTTP requests. Defaults to `false`. |
| debugNormalizer  | No        | Set to `true` to log debug messages during API payload normalization. Defaults to `false`. |

### Example with All Options

```
...
import userConfig from './config/user-config'

Vue.use(ClientAppUser, {
  logInit: true,
  debugInit: false,
  debug: false,                    --> hydrate/sync
  debugRequests: false,
  debugNormalizer: false,
  store,
  syncMode: true,                  --> enable sync mode // TODO: Move this option inside each of the resource settings !!!
  api: userConfig.api,
  user: userConfig.user,
  userProfile: userConfig.userProfile,
  userPrefs: userConfig.userPrefs,
  hydrateUserOn: 'auth/setUserInfo',
  clearUserOn: 'auth/clearSession',
})
```

### API Settings

[TBC - More in-depth information on the configuration options will be described soon]

```
------------
API Settings
------------

// Global API settings (can be overridden on the resource level)
api: {
  baseURL,        --> the base URL of the API request (protocol + host + port)
  prefixURI,      --> the prefix URI of the API request (default: '')
  contentType,    --> sets the 'Content-Type' and 'Accept' headers to this value (default: application/json)
  postForUpdate,  --> use POST instead of PUT (default: PUT)
  timeout,        --> request timeout in ms (default: 30*1000ms)
  assocNameMap,   --> a mapping object to define name transformations of associations (during normalization)
  auth: {
    scheme: 'bearer-token',          --> auth scheme to implement, options: null|bearer-token|custom-header (default: null)
    tokenGetter: 'auth/authToken',   --> vuex getter path for auth token value
    tokenHeaderName: <header_name>,  --> header name for 'custom-header' scheme
  },
},

```

### User Resource Settings

[TBC - More in-depth information on the configuration options will be described soon]

```
-------------
User Settings
-------------

user: {
  idField: 'id',                   --> the ID field for the local app user (default: 'id')
  externalIdField: 'external_id',  --> the external ID field for the source user resource, for syncMode (default: 'external_id')
  endpoints: {
    create: '/user',
    update: { uri: '/user/:id', params: { with: 'profile' } },
    fetch: { uri: '/user', params: { with: 'profile' } },
  },
  sync: true|false          --> whether or not to sync data into local database  // TODO: not yet implemented !!!
  api: { ... },             --> override api settings   // TODO: not yet implemented !!!
  model: <the_model_shape>, --> the model object/class  // TODO: support pojo !!! (right now, only class is supported)
  form: <the_data_form>     --> the data form for this resource // TODO: not yet implemented !!!
  debug: false,             --> debug settings for this resource (default: false)  // TODO: not yet implemented !!!
},

```

### User Profile Resource Settings

[TBC - More in-depth information on the configuration options will be described soon]

```
---------------------
User Profile Settings
---------------------

userProfile: {
  externalIdField: 'external_id',   --> the ID field for the source user resource (default: 'external_id')
  endpoints: {
    create: '/user-profile',
    update: '/user-profiles',
    getOne: '/user-profile/:id',
    getMany: { uri: '/user-profiles', params: { with: 'likes', skip: 0, limit: 5 }},  --> (support for including params)
    delete: '/user-profile/:id',
  },
  api: { ... },             --> override api settings   // TODO: not yet implemented !!!
  sync: true|false          --> whether or not to sync data into local database  // TODO: not yet implemented !!!
  model: <the_model_shape>, --> the model object/class  // TODO: support pojo !!! (right now, only class is supported)
  form: <the_data_form>     --> the data form for this resource // TODO: not yet implemented !!!
  debug: false,             --> debug settings for this resource (default: false)  // TODO: not yet implemented !!!
},

```

### User Prefs Resource Settings

[TBC - More in-depth information on the configuration options will be described soon]

```
-------------------
User Prefs Settings
-------------------

userPrefs: {
  externalIdField: 'external_id',   --> the ID field for the source user resource (default: 'external_id')
  endpoints: {
    create: '/user/:id/prefs',
    update: '/user/:id/prefs',
    fetch: '/user/:id/prefs',
  },
  api: { ... },             --> override api settings   // TODO: not yet implemented !!!
  sync: true|false          --> whether or not to sync data into local database  // TODO: not yet implemented !!!
  model: <the_model_shape>, --> the model object/class  // TODO: support pojo !!! (right now, only class is supported)
  form: <the_data_form>     --> the data form for this resource // TODO: not yet implemented !!!
  debug: false,             --> debug settings for this resource (default: false)  // TODO: not yet implemented !!!
},

```


## Models

[TBC - Accepts customized `User` model object/shape, but sets the anonymous state to the internal `User` properties described below]


| Model    | Description |
| -------- | ----------- |
| User     | Represents the active app user of the active web session. |

#### User as Anonymous

The `activeUser` always returns a `User` model. When un-authorized, the anonymized shape and state of the model instance will hold:

| Name                | Type    | Value |
| ------------------- | ------- | ----- |
| model               | String  | `User` |
| is_logged_in        | Boolean | `false` |
| id                  | Number  | `null` |
| external_id         | null    | `null` |
| username            | String  | `null` |
| display_name        | String  | `'Anonymous'` |
| hydrate_status_code | Number  | The resulting http status code from a failed hydration -or- `null` (if no issues occurred) |


## Store

### Getters

| Getter | Returns | Description | Example |
| ------ | --------| ----------- | ------- |
| pluginName | String | The plugin name/identifier. This value cannot be changed. | `this.$store.getters['auth/pluginName']` |
| activeUser | `User` | The active user that is using the app. The user returned is never `null`. | `this.$store.getters['auth/activeUser']` |
| activeUserToken | String | The active user auth token, obtained when a user has successfully authenticated. Returns `null` if an auth session has not been successfully established (or the active user is not logged-in). | `this.$store.getters['auth/activeUserToken']` |
| isAuthenticating | Boolean | Returns `true` when the app is performing authentication. | `this.$store.getters['auth/isAuthenticating']` |
| isAuthorizing | Boolean | Returns `true` when the app is performing authorization.  | `this.$store.getters['auth/isAuthorizing']` |
| isFetchingUserInfo | Boolean | Returns `true` when the app is fetching user information via the authenticator hook. | `this.$store.getters['auth/isFetchingUserInfo']` |

### Actions

All actions are Promises, but not all actions are asynchronous.

| Name               | Parameters | Returns   | Description | Example |
| ------------------ | ---------- | --------- | ----------- | ------- |
| authorize          | (none)     | `{ user: <the_user_model>, token: <the_auth_token> }` | TBC | `this.$store.dispatch('auth/authorize')` |
| loginUser          | creds = `{ username: <username>, password: <password> }` | `{ user: <the_user_model>, token: <the_auth_token> }` | TBC | `this.$store.dispatch('auth/loginUser', creds)` |
| logoutUser         | (none)     | `{ user: <the_user_model>, token: null }` | TBC | `this.$store.dispatch('auth/logoutUser')` |


#### Internal Actions

The following actions are available in the store, but are primarily utilized internally by the Vuestrap logic. Unless you are performing customized logic with the Client Auth Support store, you will not likely use these actions.

| Name               | Parameters | Returns   | Description | Example |
| ------------------ | ---------- | --------- | ----------- | ------- |
| setActiveUser      | `User`     | (void) | TBC | `this.$store.dispatch('auth/setActiveUser', user)` |
| clearActiveUser    | (none)     | (void) | TBC | `this.$store.dispatch('auth/clearActiveUser')` |
| fetchUserInfo      | (none)     | `{ <the_user_info> }` | TBC | `this.$store.dispatch('auth/fetchUserInfo')` |


## Components

[TBC]

| Name                | Props | Description | Example |
| ------------------- | ----- | ----------- | ------- |
| local-account-login | [TBC] | Provides a simple username/password login box. | `<local-account-login />` |

### Events

| Name                | Returns | Description | Example |
| ------------------- | ------- | ----------- | ------- |
| login | ``` creds = { ...} ``` | Emitted when login submit is clicked. | `<local-account-login v-on:login="doLogin" />` |


## For Developers

### Dev Run

To provide a fully working Vue app environment to test and develop the plugin, a simple Vue application will build (the plugin & the app bundle) and serve when running:

``` sh
$ yarn dev
```

By default, the development app environment will hot-reload changes and will run on `localhost:3305`.

> You can change the configuration for the development environment via `test/simulator/config.js`.

### Dev Lint

The plugin uses [ESLint][link-eslint-site] for source code linting. The linting will run automatically on `git commit`.

``` sh
$ yarn lint
```
> You can run with flag `--fix`, or shortcut command *flint*, to trigger auto fixing (e.g. `yarn flint`).

### Dev Test

The plugin uses [Mocha][link-mocha-site] for the testing framework,
and [Chai][link-chai-site] and [Chai-HTTP][link-chai-http-site] for its assertions.

``` sh
$ yarn test
```

### Dev Build

The plugin is automatically built on `yarn publish`. But, you can manually build the plugin using:

``` sh
$ yarn build-plugin
```


[section-introduction]: #introduction
[section-prerequisites]: #prerequisites
[section-how-to-use]: #how-to-use
[section-namespace]: #namespace
[section-options]: #options
[section-models]: #models
[section-store]: #store
[section-components]: #components
[section-for-developers]: #for-developers

[link-vue-github]: https://github.com/vuejs/vue
[link-vuex-github]: https://github.com/vuejs/vuex
[link-rollup-plugin-vue-github]: https://github.com/vuejs/rollup-plugin-vue
[link-vue-rollup-boilerplate-github]: https://github.com/dangvanthanh/vue-rollup-boilerplate

[link-eslint-site]: https://eslint.org
[link-mocha-site]: https://mochajs.org
[link-chai-site]: http://chaijs.com
[link-chai-http-site]: http://chaijs.com/plugins/chai-http
