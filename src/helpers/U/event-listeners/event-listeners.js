import ManageListeners from '../manage-listeners/manage-listeners'

const manageListeners = new ManageListeners()

const passiveSupported = (() => {
  /* Feature detection */
  let isSupported = false

  try {
    window.addEventListener(
      'test',
      null,
      Reflect.defineProperty({}, 'passive', {
        get() {
          isSupported = true
        },
      })
    )
  } catch (err) {}

  return isSupported
})()

const addRemove = {
  addListener: (...args) => addListener(...args),
  removeListener: (...args) => removeListener(...args),
}

const eventListeners = {
  touch: {
    mousedown: ({ obj, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, 'touchstart', fn),
    mousemove: ({ obj, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, 'touchmove', fn),
    mouseup: ({ obj, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, 'touchend', fn),
  },
  pointer: {
    mousedown: ({ obj, fn, prefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, `${pointerPrefix}pointerdown`, fn),
    mousemove: ({ obj, fn, prefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, `${pointerPrefix}pointermove`, fn),
    mouseup: ({ obj, fn, prefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](obj, `${pointerPrefix}pointerup`, fn),
  },
}

const addForTouchDevice = ({ type, eventType, fn, obj, pointerPrefix }) =>
  eventListeners[type][eventType]({ obj, fn, pointerPrefix })
const removeForTouchDevice = ({ type, eventType, fn, obj, pointerPrefix }) =>
  eventListeners[type][eventType]({ obj, fn, pointerPrefix, mod: 'remove' })

export const addListener = function (
  obj,
  eventType,
  fn,
  bool = false,
  options = { passive: false, caputue: false }
) {
  if (!obj) {
    throw new Error(`Target element is not suplied. ${obj}`)
  }

  if (eventType.match('mouse') && bool) {
    const pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''

    if (window.hasOwnProperty('ontouchstart')) {
      addForTouchDevice({ type: 'touch', obj, fn, eventType })
    } else if (window.hasOwnProperty(`on${pointerPrefix}pointerdown`)) {
      addForTouchDevice({ type: 'pointer', obj, fn, pointerPrefix, eventType })
    } else {
      manageListeners.add(
        obj,
        eventType,
        fn,
        passiveSupported ? options : options.caputure || false
      )
    }
  } else {
    manageListeners.add(
      obj,
      eventType,
      fn,
      passiveSupported ? options : options.caputure || false
    )
  }
}

export const removeListener = function (obj, eventType, fn, bool, callback) {
  if (!manageListeners) {
    return
  }

  if (eventType.match('mouse') && bool) {
    const pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''

    if (window.hasOwnProperty('ontouchstart')) {
      removeForTouchDevice({ type: 'pointer', obj, fn, eventType })
    } else if (window.hasOwnProperty('on' + pointerPrefix + 'pointerdown')) {
      removeForTouchDevice({ type: 'pointer', obj, fn, pointerPrefix, eventType })
    } else {
      manageListeners.remove(obj, eventType, fn, callback)
    }
  } else {
    manageListeners.remove(obj, eventType, fn, callback)
  }
}
