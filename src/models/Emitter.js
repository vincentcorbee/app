import { copyObject, copyArray } from '../helpers/U'

const _private = new WeakMap()
const _data = {
  events: {},
}
const setPrivate = inst => _private.set(inst, copyObject(_data))
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

  on(event, listener, ...args) {
    const self = this
    let { events } = getPrivate(self)
    let eq = 'fn'
    let body = ''

    if (typeof listener === 'object') {
      eq = listener.eq || eq
      listener = listener.listener
      body = listener.toString()
    }

    if (typeof listener !== 'function') {
      throw new TypeError(listener + ' is not a function')
    }

    if (events[event] === undefined) {
      events[event] = [[listener, args]]
    } else if (
      events[event].every(([fn]) =>
        eq === 'fn' ? fn !== listener : fn.toString() !== body
      )
    ) {
      events[event].push([listener, args])

      return true
    }

    return false
  }

  once(event, listener, ...args) {
    const self = this

    listener.once = true

    return self.on(event, listener, args)
  }

  off(event, listener) {
    const self = this
    let { events } = getPrivate(self)

    if (events[event] !== undefined) {
      events[event] = events[event].filter(([fn]) => fn !== listener)
    }

    return self
  }

  emit(event) {
    const self = this
    let { events } = getPrivate(self)

    if (events[event] && events.hasOwnProperty(event)) {
      events[event].forEach(([listener, args = []]) => {
        try {
          listener.apply(self, [...[].slice.call(arguments, 1), ...args])

          if (listener.once) {
            self.removeListener(event, listener)
          }
        } catch (err) {
          if (events.error) {
            events.error.apply(self, [].slice.call(arguments, 1))
          } else {
            throw err
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

    if (events[event] !== undefined) {
      return copyArray(events[event])
    }

    return null
  }

  get events() {
    return getPrivate(this).events
  }
}
