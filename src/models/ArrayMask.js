import { mix } from '../helpers/U'
import Observable from './Observable'
import copyProperties from '../helpers/copyProperties'
// Modifiers to intercept
const modifiers = ['pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort']

const _private = new WeakMap()

class ArrayMask extends Array {
  constructor(target, handler, queue) {
    super()

    // console.trace(target)

    if (typeof target !== 'object') {
      // throw new TypeError('target is not an Object')
      return
    }

    const self = this

    _private.set(this, {
      handler,
      target,
      queue,
    })

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
    if (!target.hasOwnProperty('__observable__')) {
      Reflect.defineProperty(target, '__observable__', {
        value: new Observable(),
      })

      target.__observable__.value = target
    }

    // Copy properties on Mask instance
    copyProperties(self, target, proxy.proxy)

    // Set revocable
    Reflect.defineProperty(self, 'revoke', {
      get() {
        return proxy.revoke
      },
    })

    // mix(ArrayMask, Array)
  }

  get data() {
    return _private.get(this).target
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}

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
            arguments[i] = argument.__observable__.value
          }

          i += 1
        }

        target[type].apply(target, arguments)
      }

      console.log(type, target.__observable__, target)

      queue.push(
        {
          type,
          value: arguments,
          target,
        },
        target.__observable__
      )
    })
)

export default ArrayMask
