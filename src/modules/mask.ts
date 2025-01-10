import attachObservable from '../helpers/attach-observable'
import copyProperties from '../helpers/copy-properties'
import isProxyRevoked from '../helpers/is-proxy-revoked'
import Queue from './queue'

const _private = new WeakMap()

export interface MaskInterface {
  get isRevoked(): boolean
  get data(): any
  get revoke(): () => void

  toString: () => string
}

export default class Mask<T = Record<string, any>> implements MaskInterface {
  constructor(target: any, handler = {}, queue: Queue) {
    if (typeof target !== 'object') throw new TypeError('target is not an Object')

    const proxy = Proxy.revocable(target, {
      get(target, prop) {
        return (handler as any).get(target, prop)
      },
      set(target, prop, value) {
        const isChanged = target[prop] !== value
        const success = (handler as any).set(target, prop, value)

        if (success && isChanged) {
          const updates = [
            {
              data: { type: 'set', value, prop, target },
              observable: target.__observable__,
            },
          ]

          if (Array.isArray(value) && (value as any).__observable__) {
            updates.push({
              data: { type: 'set', value: value.length, prop: 'length', target: value },
              observable: (value as any).__observable__,
            })
          }

          queue.push(updates)
        }

        return success
      },
    })

    _private.set(this, {
      target,
      proxy,
    })

    attachObservable(target)

    copyProperties(this, target, proxy.proxy)

    // if (!this.hasOwnProperty('revoke')) {
    //   Reflect.defineProperty(this, 'revoke', {
    //     get() {
    //       return proxy.revoke
    //     },
    //   })
    // }

    // if (!this.hasOwnProperty('isRevoked')) {
    //   Reflect.defineProperty(this, 'isRevoked', {
    //     get() {
    //       return isProxyRevoked(proxy.proxy)
    //     },
    //   })
    // }
  }

  get revoke() {
    return _private.get(this).proxy.revoke
  }

  get isRevoked() {
    return isProxyRevoked(_private.get(this).proxy.proxy)
  }

  get data() {
    return _private.get(this).target
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}
