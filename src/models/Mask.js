import attachObservable from '../helpers/attachObservable'
import copyProperties from '../helpers/copyProperties'
import isProxyRevoked from '../helpers/isProxyRevoked'

const _private = new WeakMap()

export default class Mask {
  constructor(target, handler = {}, queue) {
    if (typeof target !== 'object') {
      throw new TypeError('target is not an Object')
    }

    const self = this
    const proxy = Proxy.revocable(target, {
      get(target, prop) {
        return handler.get(target, prop)
      },
      set(target, prop, value) {
        // if (value && value.prototype && value.prototype.constructor === 'ArrayMask')
        //   return

        const isChanged = target[prop] !== value
        const suc = handler.set(target, prop, value)

        if (suc && isChanged) {
          const updates = [
            {
              data: { type: 'set', value, prop, target },
              observable: target.__observable__,
            },
          ]

          if (Array.isArray(value) && value.__observable__) {
            updates.push({
              data: { type: 'set', value: value.length, prop: 'length', target: value },
              observable: value.__observable__,
            })
          }

          queue.push(updates)
        }

        return suc
      },
    })

    _private.set(self, {
      target,
    })

    // Set Observable
    attachObservable(target)

    // Copy properties on Mask instance
    copyProperties(self, target, proxy.proxy)
    // Set revocable

    if (!self.hasOwnProperty('revoke')) {
      // Set revocable
      Reflect.defineProperty(self, 'revoke', {
        get() {
          return proxy.revoke
        },
      })
    }

    if (!self.hasOwnProperty('isRevoked')) {
      Reflect.defineProperty(self, 'isRevoked', {
        get() {
          return isProxyRevoked(proxy.proxy)
        },
      })
    }
  }

  get data() {
    return _private.get(this).target
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}
