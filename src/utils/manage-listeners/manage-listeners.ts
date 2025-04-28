//@ts-nocheck
import collectGarbage from './collect-garbage'

const compareFn = (a: Function, b: Function) =>
  a && b && (a === b || a.toString() === b.toString())

export class ManageListeners {
  constructor(config = {}) {
    let items = []

    const int = config.garbageCollection || 20000

    Object.defineProperties(this, {
      listeners: {
        get: () => items.slice(),
      },
      add: {
        value: (target, eventType, fn, options) => {
          if (
            items.some(
              o =>
                o.target === target &&
                o.eventType === eventType &&
                (compareFn(o.fn, fn) ||
                  compareFn(o.fn.origin, fn.origin) ||
                  compareFn(o.fn.origin, fn))
            )
          ) {
            return
          }

          items.push({
            eventType,
            fn,
            target,
          })

          target.addEventListener(eventType, fn, options)
        },
      },
      remove: {
        value: (target, eventType, fn, callback) => {
          if (items.length > 0) {
            items = items.filter(o => {
              if (
                o.target === target &&
                o.eventType === eventType &&
                (compareFn(o.fn, fn) ||
                  compareFn(o.fn.origin, fn.origin) ||
                  compareFn(o.fn.origin, fn))
              ) {
                o.target.removeEventListener(o.eventType, o.fn, false)
                return false
              } else {
                return true
              }
            })

            if (callback && typeof callback === 'function') callback(target)
          }
        },
      },
      filter: {
        value: items.filter,
      },
      forEach: {
        value: items.forEach,
      },
      length: {
        get: () => items.length,
      },
    })

    collectGarbage(this, int)
  }
}

export default ManageListeners
