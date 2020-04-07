import axios from 'axios'

export default class Ajax {
  constructor(options) {
    this.debug = options.debug
    this.logNamespace = options.logNamespace || '[XHR]'
    this.baseURL = options.baseURL || ''
    this.clientID = options.clientID
    this.timeout = options.timeout || 30 * 1000
    this.bodyWrapper = options.bodyWrapper || null
    this.globalHeaders = options.headers || {}

    // Instantiate HTTP client...
    this.http = axios.create({
      baseURL: this.baseURL,
      headers: this.globalHeaders,
      timeout: this.timeout,
    })
  }

  get(uri, opts = {}) {
    opts.method = 'GET'
    return this.performRequest(uri, opts)
  }

  post(uri, opts = {}) {
    opts.method = 'POST'
    return this.performRequest(uri, opts)
  }

  put(uri, opts = {}) {
    opts.method = 'PUT'
    return this.performRequest(uri, opts)
  }

  delete(uri, opts = {}) {
    opts.method = 'DELETE'
    return this.performRequest(uri, opts)
  }

  performRequest(uri, opts = {}) {
    const method = opts.method || 'GET'
    const bodyData = opts.body

    const requestOpts = {
      headers: Object.assign({}, this.globalHeaders, opts.headers),
      params: opts.query,
    }

    // Prepare body data...
    let data = null
    if (bodyData) {
      data = {}
      if (this.bodyWrapper) data[this.bodyWrapper] = { ...bodyData }
      else Object.assign(data, { ...bodyData })
    }

    if (this.debug) {
      console.log(`${this.logNamespace} Executing request ${method} ${uri}`)
      if (data) console.log(`${this.logNamespace} body =>`, data)
      console.log(`${this.logNamespace} options =>`, requestOpts)
    }

    let request = null
    switch (method) {
      case 'GET': request = this.http.get(uri, requestOpts); break
      case 'POST': request = this.http.post(uri, data, requestOpts); break
      case 'PUT': request = this.http.put(uri, data, requestOpts); break
      case 'DELETE': request = this.http.delete(uri, requestOpts); break
      default: request = this.http.get(uri, requestOpts)
    }

    return request
      .then(payload => payload.data)
      .catch((error) => {
        if (error.response && error.response.status) {
          if (this.debug) console.log(`${this.logNamespace} Error =>`, error.response)
          throw (error.response.data)
        }
        if (error.request) {
          const noResponseError = { name: 'Network Error', status: 503, text: 'The server did not provide a response.' }
          if (this.debug) console.log(`${this.logNamespace} Network Error =>`, noResponseError)
          throw (noResponseError)
        }
        if (this.debug) console.log(`${this.logNamespace} Error =>`, error.message)
        throw error
      })
  }
}
