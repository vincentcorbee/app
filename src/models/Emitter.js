import { copyObj, copyArr } from '../lib/U.js'
const _private = new WeakMap()
const _data = {
  events: {}
}
const setPrivate = inst => _private.set(inst, copyObj(_data))
const getPrivate = inst => {
  if (!_private.get(inst)) {
    setPrivate(inst)
  }
  return _private.get(inst)
}
export default class Emitter {
  constructor() {
    const self = this
    setPrivate(self)
  }
  on(event, listener) {
    const self = this
    let { events } = getPrivate(self)
    if (typeof listener !== 'function') {
      throw new TypeError(listener + ' is not a function')
    }
    if (events[event] === undefined) {
      events[event] = [listener]
    } else if (events[event].every(fn => fn !== listener)) {
      events[event].push(listener)
    }
    return this
  }
  once(event, listener) {
    const self = this
    listener.once = true
    return self.on(event, listener)
  }
  off(event, listener) {
    const self = this
    let { events } = getPrivate(self)
    if (events[event] !== undefined) {
      events[event] = events[event].filter(fn => fn !== listener)
    }
    return self
  }
  emit(event) {
    const self = this
    let { events } = getPrivate(self)
    if (events[event] && events.hasOwnProperty(event)) {
      events[event].forEach(listener => {
        try {
          listener.apply(self, [].slice.call(arguments, 1))
          if (listener.once) {
            self.removeListener(event, listener)
          }
        } catch (err) {
          if (events.error) {
            events.error.apply(self, [].slice.call(arguments, 1))
          } else {
            console.log(err)
          }
        }
      })
      return true
    } else {
      return false
    }
  }
  getEvent(event) {
    return getPrivate(this).events[event]
  }
  listeners(event) {
    const self = this
    let { events } = getPrivate(self)
    let listeners = null
    if (events[event] !== undefined) {
      listeners = copyArr(events[event])
    }
    return listeners
  }
}
