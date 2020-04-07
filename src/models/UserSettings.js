import objectUtils from '../utils/object-utils'

export default class UserSettings {
  constructor(options = {}) {
    this.model = 'UserSettings'
    this.id = objectUtils.get(options, 'id', null)
    this.user_id = objectUtils.get(options, 'user_id', null)
    this.settings = objectUtils.get(options, 'settings', {})
  }
}
