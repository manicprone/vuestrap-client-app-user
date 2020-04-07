import objectUtils from '../utils/object-utils'

export default class AppMessage {
  constructor(options = {}) {
    this.model = 'AppMessage'
    this.source = objectUtils.get(options, 'source', null)
    this.status_code = objectUtils.get(options, 'status_code', null)
    this.severity = objectUtils.get(options, 'severity', 'success') // 'info', 'warning', 'error', 'success'
    this.action_link = objectUtils.get(options, 'action_link', null)
    this.text = objectUtils.get(options, 'text', generateAppMessage(this))
  }
}

function generateAppMessage(data) {
  return `${data.severity} [${data.status_code}]`
}
