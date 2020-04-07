import objectUtils from '../utils/object-utils'

export default class User {
  constructor(options = {}) {
    this.model = 'User'
    this.id = objectUtils.get(options, 'id', null)
    this.external_id = objectUtils.get(options, 'external_id', null)
    this.email = objectUtils.get(options, 'email', null)
    this.username = objectUtils.get(options, 'username', this.email)
    this.display_name = objectUtils.get(options, 'display_name', this.username)
    this.first_name = objectUtils.get(options, 'first_name', null)
    this.last_name = objectUtils.get(options, 'last_name', null)
    this.preferred_locale = objectUtils.get(options, 'preferred_locale', null)
    this.created_at = objectUtils.get(options, 'created_at', null)
    this.updated_at = objectUtils.get(options, 'updated_at', null)
    this.avatar_url = objectUtils.get(options, 'avatar_url', null)
    this.avatar_thumb_url = options.avatar_thumb_url || generateAvatarThumbnail(this.avatar_url)
    this.settings = (options.settings && !options.settings.isEmpty) ? options.settings : loadDefaultSettings()
    this.roles = options.roles || loadDefaultRoleNames()
    this.profile = objectUtils.get(options, 'profile', null)
  }
}

function loadDefaultRoleNames() {
  return []
}

function loadDefaultSettings() {
  return {}
}

function generateAvatarThumbnail(avatarURL) {
  return (avatarURL) ? `${avatarURL}?sz=50` : null
}
