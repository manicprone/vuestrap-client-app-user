import objectUtils from '../utils/object-utils'

export default class Collection {
  constructor(options = {}) {
    this.model = 'Collection'
    this.items = objectUtils.get(options, 'items', [])
    this.meta = objectUtils.get(options, 'meta', {})
  }
}
