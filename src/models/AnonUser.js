export default class AnonUser {
  constructor() {
    this.model = 'User'
    this.is_logged_in = false
    this.id = null
    this.external_id = null
    this.username = null
    this.display_name = 'Anonymous'
    this.hydrate_status_code = null
  }
}
