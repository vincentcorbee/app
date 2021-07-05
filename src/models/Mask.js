import copyProperties from '../helpers/copyProperties'
import Observable from './Observable'

const _private = new WeakMap()

const isRevoked = proxy => {
  try {
    new Proxy(proxy, proxy)
    return false
  } catch (err) {
    return Object(proxy) === proxy
  }
}
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

        // console.trace(target, prop)
        const isChanged = target[prop] !== value
        const suc = handler.set(target, prop, value)

        if (suc && isChanged) {
          queue.push({ type: 'set', value, prop, target }, target.__observable__)
        }

        return suc
      },
    })

    _private.set(self, {
      target,
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

    if (!self.hasOwnProperty('revoke')) {
      Reflect.defineProperty(self, 'revoke', {
        get() {
          return proxy.revoke
        },
      })
    }

    if (!self.hasOwnProperty('isRevoked')) {
      Reflect.defineProperty(self, 'isRevoked', {
        get() {
          return isRevoked(proxy.proxy)
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
