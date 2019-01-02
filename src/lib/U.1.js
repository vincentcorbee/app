window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver
;(function() {
  'use strict'
  let timeouts = []
  let messageName = 'zero-timeout-message'
  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function setZeroTimeout(fn) {
    timeouts.push(fn)
    window.postMessage(messageName, '*')
  }
  function handleMessage(event) {
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
;(function() {
  'use strict'
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
;(function() {
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
;(function() {
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
  ;(function(int) {
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
          return
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
export const roundTo = (value, precision) => {
  let factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}
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
export const componentsReady = (components, cb, bool) => {
  const timeLimit = 5000
  const start = new Date()
  components = Array.isArray(components) ? components : [components]
  const isReady = (component, cb) => {
    let int = new Date() - start
    if (component.on !== undefined) {
      cb(component)
    } else if (int > timeLimit) {
      cb(null)
    } else {
      setTimeout(() => isReady(component, cb), 0)
    }
  }
  Promise.all(
    components.map(
      component => new Promise((resolve, reject) => isReady(component, resolve))
    )
  ).then(components => {
    if (bool === false) {
      cb(components)
    } else {
      cb.apply(this, components)
    }
  })
}
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
export const isEventSupported = (function() {
  let TAGNAMES = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img'
  }
  function isEventSupported(eventName) {
    let el = document.createElement(TAGNAMES[eventName] || 'div')
    eventName = 'on' + eventName
    let isSupported = eventName in el
    if (!isSupported) {
      el.setAttribute(eventName, 'return;')
      isSupported = typeof el[eventName] === 'function'
    }
    el = null
    return isSupported
  }
  return isEventSupported
})()
const XMLHttpRequestObject = () => {
  let ajax = null
  if (window.XMLHttpRequest) {
    ajax = new window.XMLHttpRequest()
  } else if (window.ActiveXObject) {
    ajax = new window.ActiveXObject('MSXML2.XMLHTTP.3.0')
  }
  return ajax
}
export const whichTransitionEvent = function() {
  let el = document.createElement('fakeelement')
  let transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  for (let t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t]
    }
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
export const scrollTo = function(container, obj, speed) {
  let that = U
  let offsetTop = U.isType('node', obj) ? that.getOffset(obj).y : obj
  let scrollToNode = window.setInterval(() => {
    let pos = container.scrollTop
    if (pos < offsetTop) {
      container.scrollTop = pos + 20
    } else {
      window.clearInterval(scrollToNode)
    }
  }, speed)
}
export const clamp = (value, min, max) =>
  Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))
export const passiveSupported = (function() {
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
export const addClassName = (node, name) =>
  (node.className = node.className
    ? node.className.indexOf(name) === -1
      ? node.className + ' ' + name
      : node.className
    : name)
export const removeClassName = (node, name) => {
  let classNames = node.className
    .split(' ')
    .filter(className => className !== name)
    .join(' ')
    .trim()
  if (classNames.length > 0) {
    node.className = classNames
  } else {
    node.removeAttribute('class')
  }
}
export const animate = (...objs) => {
  if (!isType('function', window.requestAnimationFrame)) {
    window.requestAnimationFrame = cb => setTimeout(cb, 1000 / 60)
  }
  let end = 0
  let d
  let obj
  let rate = 0
  const step = () => {
    let current = Date.now()
    let remaining = end - current
    if (remaining < 60) {
      if (obj) {
        rate = 1
        obj.fn(rate)
      }
      obj = objs.shift()
      if (obj) {
        d = (obj.dur || 0.5) * 1000
        end = current + d
        obj.fn(0)
      } else {
        return
      }
    } else {
      rate = remaining / d
      rate = 1 - Math.pow(rate, 3)
      obj.fn(rate)
    }
    window.requestAnimationFrame(step)
  }
  step()
}
export const getOffset = (node, parent) => {
  let offset = {
    x: 0,
    y: 0
  }
  do {
    if (parent && parent === node) {
      break
    }
    offset.x += node.offsetLeft
    offset.y += node.offsetTop
  } while ((node = node.offsetParent) !== null)
  return offset
}
export const negate = function(fn) {
  return function(...args) {
    return !fn.apply(this, ...args)
  }
}
export const getParameter = param => {
  let loc = window.location
  let queryString = loc.search ? loc.href.split('?')[1] : ''
  let parameters = queryString.split('&')
  if (parameters.length > 0) {
    return (
      parameters
        .map(data => {
          data = data.split('=')
          return data[0] === param ? data[1] : ''
        })
        .filter(par => !!par)[0] || null
    )
  } else {
    return null
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
export const createValue = string =>
  String(string)
    .replace(/\s+/g, '_')
    .replace(/\[|\]/g, '')
    .toLowerCase()
const replaceContent = (node, oldT, newT) => {
  let oC = node.textContent
  let start = oC.indexOf(oldT)
  if (start > -1) {
    let end = start + oldT.length
    let nC = oC.substring(0, start) + ' ' + newT + ' ' + oC.substring(end)
    node.textContent = nC
  }
}
export const insertAfter = (newNode, refNode) =>
  refNode.parentNode.insertBefore(newNode, refNode.nextElementSibling)
export const append = (parent, ...children) => {
  children.forEach(child => {
    if (child) {
      parent.appendChild(child)
    }
  })
  return parent
}
export const traverse = function(callback, node) {
  let that = U
  node = node || document.documentElement
  if (!that.isType('function', callback)) {
    throw new TypeError('Callback is not a function')
  }
  const fn = node => {
    that.forEach(node.childNodes, node => {
      callback(node)
      if (node.children) {
        fn(node, callback)
      }
    })
  }
  fn(node, callback)
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
export const freeze = obj => {
  const freeze = obj => {
    if (isType('Object', obj) || Array.isArray(obj)) {
      Object.freeze(obj)
      if (Array.isArray(obj)) {
        obj.forEach(el => freeze(el))
      } else {
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            freeze(obj[prop])
          }
        }
      }
    }
  }
  freeze(obj)
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
export const filterArray = (array, properties, inclusive) => {
  if (!isType('array', array)) {
    throw new TypeError(array + 'is not of type Array')
  }
  if (!isType('array', properties)) {
    throw new TypeError(properties + 'is not of type Array')
  }
  let values = {}
  inclusive = inclusive || false
  return array.filter(obj => {
    let flags = []
    properties.forEach(prop => {
      let value = obj[prop]
      if (values[prop] && values[prop].indexOf(value) > -1) {
        flags.push(true)
      } else {
        if (!values[prop]) {
          values[prop] = []
        }
        values[prop].push(value)
        flags.push(false)
      }
    })
    return inclusive
      ? flags.every(flag => flag === false)
      : flags.some(flag => flag === false)
  })
}
export const forEach = function(arr, callback, thisArg = null, i = 0) {
  if (!isType('function', callback)) {
    throw new TypeError(callback + ' is not a function.')
  }
  let that = U
  let l = arr.length
  if (i < l) {
    callback.call(thisArg, arr[i], i, arr)
    return that.forEach(arr, callback, thisArg, i + 1)
  }
}
export const map = function(arr, callback, thisArg = null) {
  if (!isType('function', callback)) {
    throw new TypeError(callback + 'is not a function.')
  }
  let l = arr.length
  let a = [l]
  let i = 0
  while (i < l) {
    a[i] = callback.call(thisArg, arr[i], i, arr)
    i += 1
  }
  return a
}
export const some = function(arr, callback, thisArg = null) {
  let flags = []
  let flag
  let i = 0
  let l = arr.length
  while (i < l) {
    flag = !!callback.call(thisArg, arr[i], i, arr)
    flags.push(flag)
    i += 1
  }
  return flags.indexOf(true) > -1
}
export const every = function(arr, callback, thisArg = null) {
  let flags = []
  let flag
  let i = 0
  let l = arr.length
  while (i < l) {
    flag = !!callback.call(thisArg, arr[i], i, arr)
    flags.push(flag)
    i += 1
  }
  return flags.indexOf(false) === -1
}
export const filter = function(arr, callback, thisArg = null) {
  if (!isType('function', callback)) {
    throw new TypeError(callback + 'is not a function.')
  }
  let l = arr.length
  let a = []
  let i = 0
  while (i < l) {
    if (callback.call(thisArg, arr[i], i, arr)) {
      a.push(arr[i])
    }
    i += 1
  }
  return a
}
export const capFirst = string =>
  String(string).replace(/^[a-z]/g, char => char.toUpperCase())
export const leadingZero = (num = 0) => (Number(num) <= 9 ? '0' + num : num)
export const bind = (oldFn, ...args) => {
  let newFn = oldFn.bind.apply(oldFn, args)
  newFn.origin = oldFn
  return newFn
}
export const removeStyles = (node, excludes) => {
  let styles =
    (node.getAttribute('style') ? node.getAttribute('style').split(';') : []).filter(
      style => excludes.some(item => style.match(item))
    ) || null
  if (styles && styles.length > 0) {
    node.setAttribute('style', styles.join(';'))
  } else {
    node.removeAttribute('style')
  }
}
export const getZindex = (selector = 'body *', ctx = document.documentElement) =>
  Array.prototype.slice.call(ctx.querySelectorAll(selector)).reduce((acc, element) => {
    let index = parseInt(window.getComputedStyle(element).zIndex, 10) || 0
    return index >= acc ? index + 1 : acc
  }, 1)
// Needs improvements
export const showHide = function(node, obj, callback) {
  const that = this
  let range = document.createRange()
  let styles = node.getAttribute('style')
  let computed = window.getComputedStyle(node)
  let marginTop = parseInt(computed.marginTop.replace('px', ''), 10)
  let marginBottom = parseInt(computed.marginBottom.replace('px', ''), 10)
  let paddingTop = parseInt(computed.paddingTop.replace('px', ''), 10)
  let paddingBottom = parseInt(computed.paddingBottom.replace('px', ''), 10)
  let maxHeight = parseInt(computed.maxHeight.replace('px', ''), 10) || 'none'
  let height =
    node.offsetHeight || (parseInt(computed.height.replace('px', ''), 10) || 0) || 0
  let action = obj.action
  let style = obj.style || 'slide'
  let speed = obj.speed || 0.2
  let display = obj.display || window.getComputedStyle(node).display
  height = maxHeight !== 'none' && height > maxHeight ? maxHeight : height
  display = display === 'inline' || display === 'none' ? 'block' || !display : display
  styles = styles ? styles.split(';').filter(prop => prop) : []
  node.style.overflow = 'hidden'
  node.style.display = display
  node.style.visibility = 'visible'
  if (action === 'show') {
    if (style !== 'fade') {
      range.selectNode(node)
      let rects = range.getBoundingClientRect()
      height = height > 0 && height < rects.height ? height : rects.height
    }
    U.animate({
      fn: rate => {
        if (style !== 'fade') {
          node.style.height = height * rate + 'px'
          node.style.marginBottom = marginBottom * rate + 'px'
          node.style.paddingBottom = paddingBottom * rate + 'px'
        } else if (style.indexOf('fade') > -1) {
          node.style.opacity = rate
        }
        if (rate === 1) {
          U.removeStyles(node, styles)
          node.setAttribute('aria-hidden', false)
          node.style.display = null
          if (callback) {
            callback(node)
          }
        }
      },
      dur: speed
    })
  } else {
    that.animate({
      fn: rate => {
        if (style !== 'fade') {
          node.style.height = height - height * rate + 'px'
          node.style.minHeight = height - height * rate + 'px'
          node.style.marginTop = marginTop - marginTop * rate + 'px'
          node.style.marginBottom = marginBottom - marginBottom * rate + 'px'
          node.style.paddingTop = paddingTop - paddingTop * rate + 'px'
          node.style.paddingBottom = paddingBottom - paddingBottom * rate + 'px'
        } else if (style.indexOf('fade') > -1) {
          node.style.opacity = 1 - rate
        }
        if (rate === 1) {
          U.removeStyles(node, styles)
          node.setAttribute('aria-hidden', true)
          if (callback && U.isType('function', callback)) {
            callback(node)
          }
        }
      },
      dur: speed
    })
  }
}
export const loader = (function(config) {
  function Loader(config = {}) {
    this.loader = null
    this.config = config
  }
  Loader.prototype = {
    constructor: Loader,
    add: function() {
      let that = this
      let config = that.config
      let position = config.position === false ? false : config.position || {}
      let target = config.target
        ? U.isType('node', config.target)
          ? config.target
          : document.getElementById(config.target) || document.querySelector(config.node)
        : document.body
      let msg = config.message || null
      let div = U.createNewElement('div', [
        'class=loader',
        'style=z-index:' + U.getZindex() + ';display:inline-block;'
      ])
      let docFrag = document.createDocumentFragment()
      if (msg) {
        U.append(div, U.createNewElement('span', ['innerHTML=' + msg]))
      }
      U.append(target, U.append(docFrag, div))
      let width = div.offsetWidth
      let height = div.offsetHeight
      let targetWidth = target ? target.offsetWidth : window.innerWidth
      let targetHeight = target ? target.offsetHeight : window.innerHeight
      if (config.position !== false) {
        div.style.top =
          position.top ||
          (((targetHeight / 2 - height / 2) / targetHeight) * 100 || 0) + '%'
        div.style.left =
          position.left && position.left !== 'center'
            ? position.left
            : (((targetWidth / 2 - width / 2) / targetWidth) * 100 || 0) + '%'
      }
      that.loader = div
      target.classList.add('loading')
      U.showHide(div, {
        action: 'show',
        style: 'fade',
        speed: config.dur
      })
    },
    remove: function(cb) {
      let that = this
      let config = that.config
      let loader = that.loader
      let target = loader.parentNode
      if (loader) {
        U.showHide(
          loader,
          {
            action: 'hide',
            style: 'fade',
            speed: config.dur
          },
          () => {
            target.classList.remove('loading')
            if (target.contains(loader)) {
              target.removeChild(loader)
            }
            that.loader = null
            if (cb && typeof cb === 'function') {
              cb()
            }
          }
        )
      }
    }
  }
  return config => {
    if (!config) {
      throw new Error('Configuration is not supplied')
    }
    return new Loader(config)
  }
})()
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
      U.ajaxRequest(req)
    })
  }
  return {
    get: req => request('GET', req),
    post: req => request('POST', req),
    put: req => request('PUT', req),
    delete: req => request('DELETE', req)
  }
})()
export const ajaxRequest = (function() {
  function Request() {
    this.payload = null
    this.contentType = null
    this.responseType = null
  }
  Request.prototype = {
    constructor: Request,
    send: function(payload) {
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
    parseResponse: function(req) {
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
    handleResponse: function(e) {
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
    listeners: function(e) {
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
    setCallback: function(req, event, status, response) {
      let that = this
      let events = that.events
      if (req.complete) {
        events[event].call(req, status, response)
      } else {
        events[event].call(req, response)
      }
    },
    computeProgress: function(e) {
      let progress = null
      if (e.lengthComputable) {
        progress = (e.loaded / e.total) * 100
      }
      return progress
    }
  }
  function FormRequest() {
    this.parts = []
    this.status = 0
    this.form = null
    this.requestData = null
  }
  FormRequest.prototype = {
    constructor: FormRequest,
    submit: function(request) {
      let that = this
      let form = (that.form = U.isType('node', request.form)
        ? request.form
        : document.getElementById(request.form))
      let formElements
      let FormData = window.FormData
      request.contentType = form
        ? form.enctype || 'application/x-www-form-urlencoded'
        : 'text/plain'
      request.url = request.url || form.action || ''
      request.method = (
        request.method ||
        form.getAttribute('method') ||
        'GET'
      ).toUpperCase()
      that.requestData = request
      if (form) {
        // Other methods than post?
        if (
          window.hasOwnProperty('FormData') &&
          (request.method === 'POST' || request.method === 'PUT') &&
          request.FormData !== false
        ) {
          that.requestData.data = new FormData(form)
          new Request().send(that.requestData)
        } else {
          formElements = form.elements
          U.forEach(formElements, (element, i) => that.getFormData(element, i))
          that.updateStatus()
        }
      } else {
        if (that.loader) {
          that.loader.remove()
        }
      }
    },
    getValue: function({ name, value }) {
      let that = this
      let contentType = that.requestData.contentType
      that.parts.push(
        contentType === 'multipart/form-data'
          ? 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n' + value + '\r\n'
          : encodeURIComponent(name) + '=' + encodeURIComponent(value)
      )
    },
    updateStatus: function() {
      let that = this
      if (that.status === 0) {
        that.requestData.data = that.parts
        new Request().send(that.requestData)
      }
    },
    readFile: function(e) {
      let that = this
      let reader = e.target
      let { file, element, result } = reader
      that.parts.push(
        'Content-Disposition: form-data; name="' +
          element.name +
          '"; filename="' +
          element.name +
          '"\r\nContent-Type: ' +
          file.type +
          '\r\n\r\n' +
          result +
          '\r\n'
      )
      that.status -= 1
      that.updateStatus()
    },
    getFiles: function(element) {
      let that = this
      let reader
      let files = element.files
      let length = files.length
      if (length > 0) {
        U.forEach(files, file => {
          that.status += 1
          reader = new window.FileReader()
          U.addListener(reader, 'load', that.readFile)
          reader.element = element
          reader.file = {}
          for (let prop in file) {
            if (file.hasOwnProperty(prop) && typeof file[prop] !== 'function') {
              reader.file[prop] = file[prop]
            }
          }
          if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            reader.readAsDataURL(file)
          } else {
            reader.readAsText(file)
          }
        })
      }
    },
    getFormData: function(element, index) {
      let that = this
      let { tagName, name } = element
      let type =
        tagName === 'SELECT'
          ? tagName.toLowerCase()
          : element.type || tagName.toLowerCase()
      if (name) {
        ;(function() {
          let table = {
            text: U.bind(that.getValue, that),
            textarea: U.bind(that.getValue, that),
            email: U.bind(that.getValue, that),
            time: U.bind(that.getValue, that),
            date: U.bind(that.getValue, that),
            tel: U.bind(that.getValue, that),
            hidden: U.bind(that.getValue, that),
            number: U.bind(that.getValue, that),
            file: U.bind(that.getFiles, that),
            radio: element => {
              if (element.checked) {
                that.getValue(element)
              }
            },
            checkbox: element => {
              if (element.checked) {
                that.getValue(element)
              }
            },
            select: element => {
              let qty = element.type
              let options = element.options
              if (/\w*multiple$/.test(qty)) {
                U.forEach(options, option => {
                  if (option.selected) {
                    that.getValue({
                      name: element.name,
                      value: option.value
                    })
                  }
                })
              } else {
                that.getValue(element)
              }
            },
            def: () => false
          }
          type = type ? (table.hasOwnProperty(type) ? type : 'def') : null
          if (type) {
            table[type](element)
          } else {
            throw new TypeError('type was not supplied.')
          }
        })()
      }
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
    if (this.form) {
      new FormRequest().submit(this)
    } else {
      new Request().send(this)
    }
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
export const resizeImg = (img, maxHeight, maxWidth) => {
  if (!img) return false
  let orgWidth = img.naturalWidth || img.width
  let orgHeight = img.naturalHeight || img.height
  let newHeight = 0
  let newWidth = 0
  let ratio = orgHeight / orgWidth
  while (
    newHeight < maxHeight &&
    newWidth < maxWidth &&
    newHeight < orgHeight &&
    newWidth < orgWidth
  ) {
    newWidth += 1
    newHeight += 1 * ratio
  }
  img.style.width = newWidth
  img.style.height = newHeight
  img.style.width = newWidth + 'px'
  img.style.height = newHeight + 'px'
  return img
}
export const U = {
  compose,
  roundTo,
  mix,
  inheritPrototype,
  componentsReady,
  fetchTemplate,
  isEventSupported,
  XMLHttpRequestObject,
  whichTransitionEvent,
  base64ToArrayBuffer,
  scrollTo,
  clamp,
  addListener,
  removeListener,
  addClassName,
  removeClassName,
  animate,
  getOffset,
  negate,
  isType,
  getParameter,
  createNewElement,
  createValue,
  replaceContent,
  insertAfter,
  append,
  traverse,
  copyArr,
  freeze,
  copyObj,
  filterArray,
  forEach,
  map,
  some,
  every,
  filter,
  capFirst,
  leadingZero,
  bind,
  removeStyles,
  getZindex,
  showHide,
  loader,
  http,
  ajaxRequest,
  resizeImg,
  passiveSupported
}
