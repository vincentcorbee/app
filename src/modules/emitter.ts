import { copyObject, copyArray } from '../utils'

const _private = new WeakMap()
const _data = {
  events: {},
}
const setPrivate = (inst: Emitter) => _private.set(inst, copyObject(_data))
const getPrivate = (
  inst: Emitter
): { events: { error: any; [key: string]: [any, any][] } } => {
  if (!_private.get(inst)) setPrivate(inst)

  return _private.get(inst)
}

export default class Emitter {
  constructor() {
    setPrivate(this)
  }

  on(event: string, listener: any, ...args: any[]) {
    let { events } = getPrivate(this)
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

  once(event: string, listener: any, ...args: any[]) {
    listener.once = true

    return this.on(event, listener, args)
  }

  off(event: string, listener: any) {
    let { events } = getPrivate(this)

    if (events[event] !== undefined) {
      events[event] = events[event].filter(([fn]) => fn !== listener)
    }

    return this
  }

  emit(event: string, _payload?: any) {
    const { events } = getPrivate(this)

    if (events[event] && events.hasOwnProperty(event)) {
      events[event].forEach(([listener, args = []]) => {
        try {
          listener.apply(this, [...[].slice.call(arguments, 1), ...args])

          if (listener.once) this.off(event, listener)
        } catch (err) {
          if (events.error) {
            events.error.apply(this, [].slice.call(arguments, 1))
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

  getEvent(event: string) {
    return getPrivate(this).events[event]
  }

  listeners(event: string) {
    const { events } = getPrivate(this)

    if (events[event] !== undefined) return copyArray(events[event])

    return null
  }

  get events() {
    return getPrivate(this).events
  }
}
