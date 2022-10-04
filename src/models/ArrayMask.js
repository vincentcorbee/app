import { mix } from '../helpers/U'
import attachObservable from '../helpers/attachObservable'
import copyProperties from '../helpers/copyProperties'
// Modifiers to intercept
const modifiers = ['pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort']

const _private = new WeakMap()

class ArrayMask {
  constructor(target, handler, queue) {
    // super()

    // console.trace(target)

    if (typeof target !== 'object') {
      throw new TypeError('target is not an Object')
    }

    _private.set(this, {
      handler,
      target,
      queue,
    })

    const self = this

    // Create proxy
    const proxy = Proxy.revocable(target, {
      get(target, prop) {
        return handler.get(target, prop)
      },
      set(target, prop, value) {
        const suc = handler.set(target, prop, value)

        if (suc) {
          target.__observable__.notify({
            type: 'set',
            value,
            prop,
            target,
          })
        }

        return suc
      },
    })

    // Set Observable
    attachObservable(target)

    // Copy properties on Mask instance
    copyProperties(self, target, proxy.proxy)

    // Set revocable
    Reflect.defineProperty(self, 'revoke', {
      value: proxy.revoke,
    })
  }

  get data() {
    return _private.get(this).target
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}

mix(ArrayMask, Array)

modifiers.forEach(
  type =>
    (ArrayMask.prototype[type] = function () {
      const { handler, target, queue } = _private.get(this)

      if (handler[type]) {
        handler[type](target, type, arguments)
      } else {
        let i = 0

        for (const argument of arguments) {
          if (argument.constructor && argument.constructor.name === 'Mask') {
            // arguments[i] = argument.__observable__.value
            arguments[i] = argument.data
          }

          i += 1
        }

        target[type].apply(target, arguments)
      }

      queue.push({
        data: {
          type,
          value: [].slice.call(arguments),
          target,
        },
        observable: target.__observable__,
      })
    })
)

export default ArrayMask
