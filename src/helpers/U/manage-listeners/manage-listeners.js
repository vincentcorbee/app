import collectGarbage from './collect-garbage/collect-garbage'

class ManageListeners {
  constructor(config = {}) {
    let items = []

    const int = config.garbageCollection || 20000

    Object.defineProperties(this, {
      listeners: {
        get: () => items.slice(),
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
            obj: obj,
          })

          obj.addEventListener(eventType, fn, options)
        },
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
