//@ts-nocheck
import ManageListeners from './manage-listeners/manage-listeners'

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
    mousedown: ({ target, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, 'touchstart', fn),
    mousemove: ({ target, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, 'touchmove', fn),
    mouseup: ({ target, fn, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, 'touchend', fn),
  },
  pointer: {
    mousedown: ({ target, fn, pointerPrefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, `${pointerPrefix}pointerdown`, fn),
    mousemove: ({ target, fn, pointerPrefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, `${pointerPrefix}pointermove`, fn),
    mouseup: ({ target, fn, pointerPrefix, mod = 'add' }) =>
      addRemove[`${mod}Listener`](target, `${pointerPrefix}pointerup`, fn),
  },
}

const addForTouchDevice = ({ type, eventType, fn, target, pointerPrefix }) =>
  eventListeners[type][eventType]({ target, fn, pointerPrefix })
const removeForTouchDevice = ({ type, eventType, fn, target, pointerPrefix }) =>
  eventListeners[type][eventType]({ target, fn, pointerPrefix, mod: 'remove' })

export const addListener = function (
  target,
  eventType,
  fn,
  bool = false,
  options = { passive: false, caputue: false }
) {
  if (!target) throw new Error(`Target element is not suplied. ${target}`)

  if (eventType.match('mouse') && bool) {
    const pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''

    if (window.hasOwnProperty('ontouchstart')) {
      addForTouchDevice({ type: 'touch', target, fn, eventType })
    } else if (window.hasOwnProperty(`on${pointerPrefix}pointerdown`)) {
      addForTouchDevice({
        type: 'pointer',
        target,
        fn,
        pointerPrefix,
        eventType,
      })
    } else {
      manageListeners.add(
        target,
        eventType,
        fn,
        passiveSupported ? options : options.caputure || false
      )
    }
  } else {
    manageListeners.add(
      target,
      eventType,
      fn,
      passiveSupported ? options : options.caputure || false
    )
  }
}

export const removeListener = function (
  target,
  eventType,
  fn,
  bool = false,
  callback?: (target: HTMLElement) => void
) {
  if (!manageListeners) return

  if (eventType.match('mouse') && bool) {
    const pointerPrefix = window.hasOwnProperty('onmspointerdown') ? 'ms' : ''

    if (window.hasOwnProperty('ontouchstart')) {
      removeForTouchDevice({ type: 'touch', target, fn, eventType })
    } else if (window.hasOwnProperty(`on${pointerPrefix}pointerdown`)) {
      removeForTouchDevice({
        type: 'pointer',
        target,
        fn,
        pointerPrefix,
        eventType,
      })
    } else {
      manageListeners.remove(target, eventType, fn, callback)
    }
  } else {
    manageListeners.remove(target, eventType, fn, callback)
  }
}
