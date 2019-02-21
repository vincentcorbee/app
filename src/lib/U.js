window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver
;(() => {
  let timeouts = []
  let messageName = 'zero-timeout-message'
  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  const setZeroTimeout = fn => {
    timeouts.push(fn)
    window.postMessage(messageName, '*')
  }
  const handleMessage = event => {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation()
      if (timeouts.length > 0) {
        let fn = timeouts.shift()
        fn()
        fn = null
      }
    }
  }
  window.addEventListener('message', handleMessage, true)
  // Add the one thing we want added to the window object.
  window.setZeroTimeout = setZeroTimeout
})()
// Polyfill send as binary -- MDNApp.charts.overview.today
;(() => {
  if (!window.XMLHttpRequest.prototype.sendAsBinary) {
    window.XMLHttpRequest.prototype.sendAsBinary = function(sData) {
      let nBytes = sData.length
      let ui8Data = new window.Uint8Array(nBytes)
      let nIdx
      for (nIdx = 0; nIdx < nBytes; nIdx += 1) {
        ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff
      }
      /* send as ArrayBufferView...: */
      this.send(ui8Data)
      /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
    }
  }
})()
// Polyfill CustomEvent -- MDN
;(() => {
  if (typeof window.CustomEvent === 'function') {
    return false
  }
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
})()
;(() => {
  if (typeof window.Event === 'function') {
    return false
  }
  function Event(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }
    var evt = document.createEvent('Event')
    evt.initEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  Event.prototype = window.Event.prototype
  window.Event = Event
})()
function AddedListeners(U, config) {
  config = config || {}

  let that = this
  let items = []
  let int = config.garbageCollection || 20000

  ;(int => {
    let collectGarbage = int => {
      let s = new Date()
      let interval = () => {
        setTimeout(() => {
          let t = new Date()
          if (t - s >= int) {
            items = items.filter(o => {
              if (U.isType('node', o.obj)) {
                return document.body.contains(o.obj)
              } else {
                return true
              }
            })
            collectGarbage(int)
          } else {
            interval()
          }
        }, 500)
      }
      interval()
    }
    collectGarbage(int)
  })(int)
  Object.defineProperties(that, {
    listeners: {
      get: () => items.slice()
    },
    add: {
      value: (obj, eventType, fn, options) => {
        if (
          items.some(
            o =>
              o.obj === obj &&
              o.eventType === eventType &&
              (o.fn === fn ||
                (o.fn.origin !== undefined &&
                  (o.fn.origin === fn.origin || o.fn.origin === fn)))
          )
        ) {
          return false
        }
        items.push({
          eventType: eventType,
          fn: fn,
          obj: obj
        })
        obj.addEventListener(eventType, fn, options)
      }
    },
    remove: {
      value: (obj, eventType, fn, callback) => {
        if (items.length > 0) {
          items = items.filter(o => {
            if (
              o.obj === obj &&
              o.eventType === eventType &&
              (o.fn === fn ||
                (o.fn.origin !== undefined &&
                  (o.fn.origin === fn.origin || o.fn.origin === fn)))
            ) {
              o.obj.removeEventListener(o.eventType, o.fn, false)
              return false
            } else {
              return true
            }
          })
          if (callback && typeof callback === 'function') {
            callback(obj)
          }
        }
      }
    },
    filter: {
      value: items.filter
    },
    forEach: {
      value: items.forEach
    },
    length: {
      get: () => items.length
    }
  })
}
const ajaxRequest = (function() {
  function Request() {
    this.payload = null
    this.contentType = null
    this.responseType = null
  }
  Request.prototype = {
    constructor: Request,
    send(payload) {
      let that = this
      let ajax = new window.XMLHttpRequest()
      let FormData = window.FormData
      let method = payload.method ? payload.method.toUpperCase() : 'GET'
      let data = payload.data
        ? payload.data instanceof FormData
          ? payload.data
          : U.isType('array', payload.data)
          ? payload.data
          : [payload.data]
        : []
      let url =
        method !== 'POST' && method !== 'PUT' && data.length > 0
          ? payload.url + '?' + data.join('&').replace(/%20/g, '+')
          : payload.url
      let contentType = (that.contentType =
        payload.contentType || 'application/x-www-form-urlencoded')
      let requestUpload = payload.upload || {}
      let headers = payload.headers || []
      let complete = (ajax.complete = payload.complete)
      let hasFormData = data instanceof FormData
      let events = (that.events = {
        load: payload.load || complete || null,
        error: payload.error || complete || null,
        progress: payload.progress || null,
        abort: payload.abort || null
      })
      let uploadEvents = (that.uploadEvents = {
        load: requestUpload.load || null,
        progress: requestUpload.progress || null,
        error: requestUpload.error || null,
        abort: requestUpload.abort || null
      })
      let cashing = payload.cashed === undefined || payload.cashed
      let uniqueUri = cashing ? '' : (/\?/.test(url) ? '&' : '?') + new Date().getTime()
      let boundary = '---------------------------' + Date.now().toString(16)
      let crlf = '\r\n'
      that.responseType = payload.responseType || null
      that.payload = payload
      if ('onload' in ajax) {
        for (let event in events) {
          if (events.hasOwnProperty(event) && !!events[event]) {
            U.addListener(ajax, event, U.bind(that.listeners, that))
          }
        }
        for (let event in uploadEvents) {
          if (uploadEvents.hasOwnProperty(event) && !!uploadEvents[event]) {
            U.addListener(ajax.upload, event, U.bind(that.listeners, that))
          }
        }
      } else {
        U.addListener(ajax, 'readystatechange', that.handleResponse, data)
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
            data = data
              .join(contentType === 'text/plain' ? crlf : '&')
              .replace(/%20/g, '+')
          }
        }
      }
      ajax.withCredentials = payload.withCredentials
      // Set request headers
      headers.forEach(header => {
        header = header.split(':')
        let key = header[0].trim()
        let value = header[1].trim()
        ajax.setRequestHeader(key, value)
      })
      ajax.send(data)
    },
    parseResponse(req) {
      let res
      let that = this
      let contentType =
        that.responseType || req.getResponseHeader('Content-Type') || 'text/plain'
      switch (contentType) {
        case 'text/plain':
        case 'text/csv':
          res = req.responseText
          break
        case 'text/xml':
          res =
            req.responseXML ||
            new window.DOMParser().parseFromString(req.responseText, 'text/xml')
          break
        case 'text/html':
          res = new window.DOMParser().parseFromString(req.responseText, 'text/html')
          break
        default:
          res = JSON.parse(req.responseText)
      }
      return res
    },
    handleResponse(e) {
      let that = this
      let req = e.target

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
    },
    listeners(e) {
      let that = this
      let type = e.type
      let req = e.target
      let events =
        req instanceof window.XMLHttpRequestUpload ? that.uploadEvents : that.events
      let table = {
        load: req => {
          U.removeListener(req, 'error', that.listeners)
          if ((req.status >= 200 && req.status <= 300) || req.status === 304) {
            that.setCallback(req, type, false, that.parseResponse(req))
          } else {
            that.setCallback(req, 'error', true, that.parseResponse(req))
          }
        },
        error: req => {
          U.removeListener(req, type, that.listeners)
          that.setCallback(req, type, true, that.parseResponse(req))
        },
        progress: req => {
          req.progress = that.computeProgress(e)
          events.progress.call(req, e)
        },
        abort: req => {
          U.removeListener(req, 'error', that.listeners)
          events.abort.call(req, e)
        }
      }
      if (events[type]) {
        if (that.payload.loader) {
          that.payload.loader.remove()
        }
        U.removeListener(req, type, that.listeners)
        table[type](req)
      }
    },
    setCallback(req, event, status, response) {
      let that = this
      let events = that.events
      if (req.complete) {
        events[event].call(req, status, response)
      } else {
        events[event].call(req, response)
      }
    },
    computeProgress(e) {
      let progress = null
      if (e.lengthComputable) {
        progress = (e.loaded / e.total) * 100
      }
      return progress
    }
  }
  function RequestData(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        this[prop] = obj[prop]
      }
    }
    if (this.loader) {
      this.loader = U.loader(this.loader)
      this.loader.add()
    }

    new Request().send(this)
  }
  return function(obj) {
    if (!obj) {
      throw new Error('Data is not supplied')
    }
    if (!obj.hasOwnProperty('callback') && typeof obj.callback === 'function') {
      throw new TypeError(obj.callback + ' is not a function')
    }
    return new RequestData(obj)
  }
})()
export const isType = (type, obj) => {
  let value
  switch (type.toLowerCase()) {
    case 'function':
      value = 'Function'
      break
    case 'array':
      value = 'Array'
      break
    case 'object':
      value = 'Object'
      break
    case 'string':
      value = 'String'
      break
    case 'boolean':
      value = 'Boolean'
      break
    case 'documentfragment':
      value = 'DocumentFragment'
      break
    case 'node':
      if (!obj || !obj.nodeType) {
        return false
      }
      value = Object.prototype.toString.call(obj).match(/[^\s\]]+(?=])/)[0]
      break
    default:
      throw new TypeError(type + ' is not a recognized type')
  }
  return Object.prototype.toString.call(obj) === '[object ' + value + ']'
}
export const compose = (...fns) => fns.reduce((a, f) => (...args) => f(a(...args)))

export const mix = (Mix, ...mixins) => {
  const copyProperties = (target, source) => {
    for (let key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        let desc = Object.getOwnPropertyDescriptor(source, key)
        Reflect.defineProperty(target, key, desc)
      }
    }
  }
  for (let mixin of mixins) {
    copyProperties(Mix, mixin)
    if (Mix.prototype) {
      copyProperties(Mix.prototype, mixin.prototype)
    } else {
      copyProperties(Mix, mixin.prototype)
    }
  }
}
export const inheritPrototype = (superType, ...subTypes) =>
  subTypes.forEach(subType => {
    let prototype = Object.create(superType.prototype)
    prototype.constructor = subType
    subType.prototype = prototype
  })
export const fetchTemplate = async template => {
  try {
    const res = await window.fetch(template, {
      credentials: 'same-origin'
    })
    const text = await res.text()
    const DOM = new window.DOMParser().parseFromString(text, 'text/html')
    return DOM.querySelector('template') || DOM
  } catch (err) {
    return document.createElement('template')
  }
}

export const base64ToArrayBuffer = base64 => {
  let binaryString = window.atob(base64)
  let len = binaryString.length
  let bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
const passiveSupported = (function() {
  /* Feature detection */
  let isSupported = false
  try {
    window.addEventListener(
      'test',
      null,
      Reflect.defineProperty({}, 'passive', {
        get() {
          isSupported = true
        }
      })
    )
  } catch (err) {}
  return isSupported
})()
export const addListener = function(
  obj,
  eventType,
  fn,
  bool = false,
  options = { passive: false, caputue: false }
) {
  if (!obj) {
    throw new Error('Target element is not suplied. ' + obj)
  }
  U.addedListeners = U.addedListeners || new AddedListeners(U)
  if (eventType.match('mouse') && bool) {
    ;(function() {
      let pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''
      let pointer
      let touch
      if (window.hasOwnProperty('ontouchstart')) {
        touch = {
          mousedown: () => addListener(obj, 'touchstart', fn),
          mousemove: () => addListener(obj, 'touchmove', fn),
          mouseup: () => addListener(obj, 'touchend', fn)
        }
        touch[eventType]()
      } else if (window.hasOwnProperty('on' + pointerPrefix + 'pointerdown')) {
        pointer = {
          mousedown: () => addListener(obj, pointerPrefix + 'pointerdown', fn),
          mousemove: () => addListener(obj, pointerPrefix + 'pointermove', fn),
          mouseup: () => addListener(obj, pointerPrefix + 'pointerup', fn)
        }
        pointer[eventType]()
      } else {
        U.addedListeners.add(
          obj,
          eventType,
          fn,
          passiveSupported ? options : options.caputure || false
        )
      }
    })()
  } else {
    U.addedListeners.add(
      obj,
      eventType,
      fn,
      passiveSupported ? options : options.caputure || false
    )
  }
}
export const removeListener = function(obj, eventType, fn, bool, callback) {
  if (!U.addedListeners) {
    return
  }
  if (eventType.match('mouse') && bool) {
    ;(function() {
      let pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''
      let pointer
      let touch
      if (window.hasOwnProperty('ontouchstart')) {
        touch = {
          mousedown: () => removeListener(obj, 'touchstart', fn),
          mousemove: () => removeListener(obj, 'touchmove', fn),
          mouseup: () => removeListener(obj, 'touchend', fn)
        }
        touch[eventType]()
      } else if (window.hasOwnProperty('on' + pointerPrefix + 'pointerdown')) {
        pointer = {
          mousedown: () => removeListener(obj, pointerPrefix + 'pointerdown', fn),
          mousemove: () => removeListener(obj, pointerPrefix + 'pointermove', fn),
          mouseup: () => removeListener(obj, pointerPrefix + 'pointerup', fn)
        }
        pointer[eventType]()
      } else {
        U.addedListeners.remove(obj, eventType, fn, callback)
      }
    })()
  } else {
    U.addedListeners.remove(obj, eventType, fn, callback)
  }
}
export const createNewElement = (type = null, attributes = null, ns = null) => {
  if (!type) {
    throw new ReferenceError('Type is not supplied')
  }
  attributes = Array.isArray(attributes) ? attributes : null
  let el
  if (ns) {
    el = document.createElementNS(ns[0], type)
  } else if (type === 'documentFragment') {
    el = document.createDocumentFragment()
  } else {
    el = document.createElement(type)
  }
  if (attributes) {
    attributes.forEach(keyvalue => {
      let data = keyvalue.split(/=([\S\s]+)?/)
      let attribute = data[0]
      let value = data[1]
      if (attribute === 'content') {
        el.textContent = value
      } else if (attribute === 'innerHTML') {
        el.innerHTML = value
      } else if (attribute) {
        el.setAttribute(attribute, value === undefined ? '' : value)
      }
    })
  }
  return el
}
export const append = (parent, ...children) => {
  children.forEach(child => {
    if (child) {
      parent.appendChild(child)
    }
  })
  return parent
}
export const copyArr = arr => {
  const copy = () => {
    let copied = []
    let l = arr.length
    let i = 0
    let prop
    while (i < l) {
      if (isType('Array', arr[i])) {
        copied[i] = copy[arr[i]]
      } else if (isType('Object', arr[i])) {
        copied[i] = copyObj(arr[i])
      } else {
        copied[i] = arr[i]
      }
      i += 1
    }
    // Copy any methods and properties added to instance of array
    for (prop in arr) {
      if (arr.hasOwnProperty(prop) && !/^\d$/.test(prop)) {
        copied[prop] = arr[prop]
      }
    }
    return copied
  }
  return copy(arr)
}
export const copyObj = obj => {
  const copy = obj => {
    let copied = Object.create(obj || null)
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (isType('Object', obj[prop])) {
          copied[prop] = copy(obj[prop])
        } else if (isType('Array', obj[prop])) {
          copied[prop] = copyArr(obj[prop])
        } else {
          copied[prop] = obj[prop]
        }
      }
    }
    return copied
  }
  return copy(obj)
}
export const bind = (oldFn, ...args) => {
  let newFn = oldFn.bind.apply(oldFn, args)
  newFn.origin = oldFn
  return newFn
}
export const http = (function() {
  const request = (method, req) => {
    return new Promise((resolve, reject) => {
      req.complete = function(err, res) {
        if (err) {
          reject(res, this)
        } else {
          resolve(res, this)
        }
      }
      req.method = method
      ajaxRequest(req)
    })
  }
  return {
    get: req => request('GET', req),
    post: req => request('POST', req),
    put: req => request('PUT', req),
    delete: req => request('DELETE', req)
  }
})()
export const U = {
  compose,
  mix,
  inheritPrototype,
  fetchTemplate,
  base64ToArrayBuffer,
  addListener,
  removeListener,
  isType,
  createNewElement,
  append,
  copyObj,
  bind,
  http
}
