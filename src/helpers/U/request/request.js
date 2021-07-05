import bind from '../bind/bind'
import isType from '../is-type/is-type'
import { addListener, removeListener } from '../event-listeners/event-listeners'

class Request {
  constructor() {
    this.payload = null
    this.contentType = null
    this.responseType = null
  }

  send(payload) {
    const that = this
    const ajax = new window.XMLHttpRequest()
    const FormData = window.FormData
    const method = payload.method ? payload.method.toUpperCase() : 'GET'
    let data = payload.data
      ? payload.data instanceof FormData
        ? payload.data
        : isType('array', payload.data)
        ? payload.data
        : [payload.data]
      : []
    const url =
      method !== 'POST' && method !== 'PUT' && data.length > 0
        ? payload.url + '?' + data.join('&').replace(/%20/g, '+')
        : payload.url
    const contentType = (that.contentType =
      payload.contentType || 'application/x-www-form-urlencoded')
    const requestUpload = payload.upload || {}
    const headers = payload.headers || []
    const complete = (ajax.complete = payload.complete)
    const hasFormData = data instanceof FormData
    const events = (that.events = {
      load: payload.load || complete || null,
      error: payload.error || complete || null,
      progress: payload.progress || null,
      abort: payload.abort || null,
    })
    const uploadEvents = (that.uploadEvents = {
      load: requestUpload.load || null,
      progress: requestUpload.progress || null,
      error: requestUpload.error || null,
      abort: requestUpload.abort || null,
    })
    const cashing = payload.cashed === undefined || payload.cashed
    const uniqueUri = cashing ? '' : (/\?/.test(url) ? '&' : '?') + new Date().getTime()
    const boundary = '---------------------------' + Date.now().toString(16)
    const crlf = '\r\n'

    that.responseType = payload.responseType || null
    that.payload = payload

    if ('onload' in ajax) {
      for (const event in events) {
        if (events.hasOwnProperty(event) && !!events[event]) {
          addListener(ajax, event, bind(that.listeners, that))
        }
      }

      for (const event in uploadEvents) {
        if (uploadEvents.hasOwnProperty(event) && !!uploadEvents[event]) {
          addListener(ajax.upload, event, bind(that.listeners, that))
        }
      }
    } else {
      addListener(ajax, 'readystatechange', that.handleResponse, data)
    }

    if (method !== 'POST' && method !== 'PUT') {
      ajax.open(method, url + uniqueUri, true)

      data = null
    } else {
      ajax.open(method, url + uniqueUri, true)

      if (!hasFormData) {
        if (contentType === 'multipart/form-data') {
          ajax.setRequestHeader('Content-Type', contentType + '; boundary=' + boundary)
          data =
            '--' +
            boundary +
            crlf +
            data.join('--' + boundary + crlf) +
            '--' +
            boundary +
            crlf
        } else {
          ajax.setRequestHeader('Content-Type', contentType)

          data = data.join(contentType === 'text/plain' ? crlf : '&').replace(/%20/g, '+')
        }
      }
    }

    ajax.withCredentials = payload.withCredentials

    // Set request headers
    headers.forEach(header => {
      const [key, value] = header.split(':')
      ajax.setRequestHeader(key.trim(), value.trim())
    })

    ajax.send(data)
  }

  parseResponse(req) {
    const that = this
    const contentType =
      that.responseType || req.getResponseHeader('Content-Type') || 'text/plain'

    switch (contentType) {
      case 'text/plain':
      case 'text/csv':
        return req.responseText
      case 'text/xml':
        return (
          req.responseXML ||
          new window.DOMParser().parseFromString(req.responseText, 'text/xml')
        )
      case 'text/html':
        return new window.DOMParser().parseFromString(req.responseText, 'text/html')
      default:
        return JSON.parse(req.responseText)
    }
  }

  handleResponse(e) {
    const that = this
    const req = e.target

    if (req.readyState === 4) {
      if ((req.status >= 200 && req.status <= 300) || req.status === 304) {
        if (that.payload.loader) {
          that.payload.loader.remove()
        }
        return that.setCallback(req, 'load', false, that.parseResponse(req))
      } else {
        return that.setCallback(req, 'error', true, that.parseResponse(req))
      }
    }
  }

  listeners(e) {
    const that = this
    const { type, target: req } = e
    const events =
      req instanceof window.XMLHttpRequestUpload ? that.uploadEvents : that.events
    const table = {
      load: req => {
        removeListener(req, 'error', that.listeners)
        if ((req.status >= 200 && req.status <= 300) || req.status === 304) {
          that.setCallback(req, type, false, that.parseResponse(req))
        } else {
          that.setCallback(req, 'error', true, that.parseResponse(req))
        }
      },
      error: req => {
        removeListener(req, type, that.listeners)
        that.setCallback(req, type, true, that.parseResponse(req))
      },
      progress: req => {
        req.progress = that.computeProgress(e)
        events.progress.call(req, e)
      },
      abort: req => {
        removeListener(req, 'error', that.listeners)
        events.abort.call(req, e)
      },
    }

    if (events[type]) {
      if (that.payload.loader) {
        that.payload.loader.remove()
      }
      removeListener(req, type, that.listeners)

      table[type](req)
    }
  }

  setCallback(req, event, status, response) {
    const that = this
    const events = that.events

    if (req.complete) {
      events[event].call(req, status, response)
    } else {
      events[event].call(req, response)
    }
  }

  computeProgress(e) {
    if (e.lengthComputable) {
      return (e.loaded / e.total) * 100
    }

    return null
  }
}

export default Request
