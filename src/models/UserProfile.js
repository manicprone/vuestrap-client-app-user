import objectUtils from '../utils/object-utils'

export default class UserProfile {
  constructor(options = {}) {
    this.model = 'UserProfile'
    this.id = objectUtils.get(options, 'id', null)
    this.user_id = objectUtils.get(options, 'user_id', null)
    this.title = objectUtils.get(options, 'title', null)
    this.tagline = objectUtils.get(options, 'tagline', null)
    this.description = objectUtils.get(options, 'description', null)
  }
}
