import { copyArray } from '../utils'
import Emitter from './emitter'

const _private = new WeakMap()

export default class Dispatcher extends Emitter {
  dispatch: (e: any) => void

  constructor(...args: any[]) {
    super()

    let self = this

    _private.set(self, {
      args,
      events: {},
    })

    if (args.length > 0) args.forEach(o => self.addEvent(o.event, o.callback))

    this.dispatch = function (e: any) {
      let target = e.target
      let currentTarget = e.currentTarget
      let actions = [e.type]
      let { events } = _private.get(self)

      if (target && target.getAttribute && target.dataset.action) {
        actions = target.dataset.action.split(',')
      } else if (
        currentTarget &&
        currentTarget.getAttribute &&
        currentTarget.dataset.action
      ) {
        actions = currentTarget.dataset.action.split(',')
        target = currentTarget
      }

      actions.forEach(event => {
        if (events[event] && events.hasOwnProperty(event)) {
          events[event].forEach((listener: any) => {
            try {
              listener.apply(self, [e, target, event])

              if (listener.once) {
                self.removeListener(event, listener)
              }
            } catch (err) {
              if (events.error && events.hasOwnProperty('error')) {
                self.dispatch({
                  type: 'error',
                  err: err,
                  target: self,
                })
              } else {
                console.error(err)
              }
            }
          })
          return true
        } else {
          return false
        }
      })
    }
  }

  // @ts-ignore
  override once(event: string, listener: any) {
    listener.once = true

    return this.addEvent(event, listener)
  }

  removeListener(event: string, listener: any) {
    const events = _private.get(this).events

    if (events[event] !== undefined) {
      events[event] = events[event].filter((fn: any) => fn !== listener)
    }

    return this
  }

  listeners(event: string) {
    const events = _private.get(this).events

    let listeners = null

    if (events[event] !== undefined) listeners = copyArray(events[event])

    return listeners
  }

  addEvents(...args: any[]) {
    if (args.length > 0) args.forEach(o => this.addEvent(o.event, o.callback))

    return this
  }

  addEvent(event: string, listener: any) {
    const { events } = _private.get(this)

    if (typeof listener !== 'function')
      throw new TypeError(`${listener} is not a function`)

    if (events[event] === undefined) {
      events[event] = [listener]
    } else if (events[event].every((fn: any) => fn !== listener)) {
      events[event].push(listener)
    }

    return this
  }

  removeEvent(event: string) {
    const events = _private.get(this).events

    delete events[event]

    return this
  }
}
