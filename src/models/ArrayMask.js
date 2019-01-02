import { mix } from '../lib/U'
import Observable from './Observable'
import copyProperties from '../helpers/copyProperties'

export default class ArrayMask {
  constructor(target, handler = {}, vm, queue) {
    if (typeof target !== 'object') {
      throw new TypeError('target is not an Object')
    }
    const self = this
    // Modifiers to intercept
    const modifiers = ['pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort']
    // Create proxy
    const proxy = Proxy.revocable(target, {
      get(target, prop) {
        return handler.get(target, prop)
      },
      set(target, prop, value) {
        let suc = handler.set(target, prop, value)
        if (suc) {
          target.__observable__.notify({
            type: 'set',
            value,
            prop,
            target
          })
        }
        return suc
      }
    })
    // Set Observable
    if (!target.hasOwnProperty('__observable__')) {
      Reflect.defineProperty(target, '__observable__', {
        value: new Observable()
      })
      target.__observable__.value = target
    }
    // Copy properties on Mask instance
    copyProperties(self, target, proxy.proxy)
    // Set revocable
    Reflect.defineProperty(self, 'revoke', {
      get() {
        return proxy.revoke
      }
    })
    // Set prototype properties on Mask instance
    mix(ArrayMask, Array)
    // Set array modifers this is stupid, happens on every instance
    modifiers.forEach(modifier =>
      Reflect.defineProperty(self, modifier, {
        value() {
          if (handler[modifier]) {
            handler[modifier](target, modifier, arguments)
          } else {
            let i = 0
            for (const argument of arguments) {
              i += 1
              if (argument.constructor && argument.constructor.name === 'Mask') {
                arguments[i] = argument.__observable__.value
              }
            }
            target[modifier].apply(target, arguments)
          }
          queue.push(
            {
              type: modifier,
              value: arguments,
              target
            },
            target.__observable__
          )
        }
      })
    )
  }
  toString() {
    return JSON.stringify(this)
  }
}
