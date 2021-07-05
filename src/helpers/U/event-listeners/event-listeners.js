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

export const addListener = function (
  obj,
  eventType,
  fn,
  bool = false,
  options = { passive: false, caputue: false }
) {
  if (!obj) {
    throw new Error('Target element is not suplied. ' + obj)
  }

  if (eventType.match('mouse') && bool) {
    const pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''

    if (window.hasOwnProperty('ontouchstart')) {
      const touch = {
        mousedown: () => addListener(obj, 'touchstart', fn),
        mousemove: () => addListener(obj, 'touchmove', fn),
        mouseup: () => addListener(obj, 'touchend', fn),
      }
      touch[eventType]()
    } else if (window.hasOwnProperty('on' + pointerPrefix + 'pointerdown')) {
      const pointer = {
        mousedown: () => addListener(obj, pointerPrefix + 'pointerdown', fn),
        mousemove: () => addListener(obj, pointerPrefix + 'pointermove', fn),
        mouseup: () => addListener(obj, pointerPrefix + 'pointerup', fn),
      }
      pointer[eventType]()
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
      const touch = {
        mousedown: () => removeListener(obj, 'touchstart', fn),
        mousemove: () => removeListener(obj, 'touchmove', fn),
        mouseup: () => removeListener(obj, 'touchend', fn),
      }
      touch[eventType]()
    } else if (window.hasOwnProperty('on' + pointerPrefix + 'pointerdown')) {
      const pointer = {
        mousedown: () => removeListener(obj, pointerPrefix + 'pointerdown', fn),
        mousemove: () => removeListener(obj, pointerPrefix + 'pointermove', fn),
        mouseup: () => removeListener(obj, pointerPrefix + 'pointerup', fn),
      }
      pointer[eventType]()
    } else {
      manageListeners.remove(obj, eventType, fn, callback)
    }
  } else {
    manageListeners.remove(obj, eventType, fn, callback)
  }
}
