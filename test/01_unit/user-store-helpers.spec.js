import { expect } from 'chai'
import * as StoreHelpers from '../../src/store/user-store-helpers'

describe('USER-STORE-HELPERS', () => {

  describe('processResourceConfig', () => {
    it('should normalize all endpoint configurations', () => {
      const stringFormat = {
        name: 'user',
        endpoints: {
          fetch: '/user/:id',
          create: '/user',
          update: '/user/:id',
        },
      }

      const mixedFormat = {
        name: 'user',
        endpoints: {
          fetch: { uri: '/user/:id', params: {} },
          create: '/user',
          update: { uri: '/user/:id', params: {} },
        },
      }

      const withParams = {
        name: 'user',
        endpoints: {
          fetch: { uri: '/user/:id', params: { with: 'profile', load: 'roles' } },
          create: { uri: '/user', params: { with: 'roles,profile', createProfile: true } },
          update: { uri: '/user/:id', params: { with: 'roles,profile' } },
        },
      }

      const configFromStringFormat = StoreHelpers.processResourceConfig(stringFormat)
      const configFromMixedFormat = StoreHelpers.processResourceConfig(mixedFormat)
      const configWithParams = StoreHelpers.processResourceConfig(withParams)

      // String format is converted to object format...
      expect(configFromStringFormat.endpoints).to.deep.equal({
        fetch: { uri: '/user/:id', params: {} },
        create: { uri: '/user', params: {} },
        update: { uri: '/user/:id', params: {} },
      })

      // Normalization should yield equivalence...
      expect(configFromMixedFormat.endpoints).to.deep.equal(configFromStringFormat.endpoints)

      // Parameters should be included...
      expect(configWithParams.endpoints).to.deep.equal(withParams.endpoints)
    })
  }) // END - processResourceConfig

}) // END - USER-STORE-HELPERS
