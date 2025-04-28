import { mix } from '../utils'
import { copyProperties, attachObservable } from '../helpers'
import Queue from './queue'

interface ArrayMaskInterface<T> {
  push(...items: T[]): number
  pop(): T | undefined
  shift(): T | undefined
  unshift(...items: T[]): number
  splice(start: number, deleteCount: number, ...items: T[]): T[]
  reverse(): T[]
  sort(compareFn?: (a: T, b: T) => number): this
}

const ArrayModifiers = [
  'pop',
  'push',
  'reverse',
  'shift',
  'unshift',
  'splice',
  'sort',
] as const

const _private = new WeakMap()

class ArrayMask<T> implements ArrayMaskInterface<T> {
  constructor(target: any, handler: any, queue: Queue) {
    if (typeof target !== 'object') throw new TypeError('target is not an Object')

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

    _private.set(this, {
      handler,
      target,
      queue,
      proxy,
    })

    attachObservable(target)

    copyProperties(this, target, proxy.proxy)
  }

  pop(): T | undefined {
    return
  }

  push(): number {
    return 0
  }

  shift(): T | undefined {
    return
  }

  unshift(): number {
    return 0
  }

  splice(): T[] {
    return []
  }

  reverse(): T[] {
    return []
  }

  sort(): this {
    return this
  }

  get revoke() {
    return _private.get(this).proxy.revoke
  }

  get data() {
    return _private.get(this).target
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}

mix(ArrayMask, Array)

ArrayModifiers.forEach(
  type =>
    (ArrayMask.prototype[type] = function () {
      const { handler, target, queue } = _private.get(this)

      let result

      if (handler[type]) {
        handler[type](target, type, arguments)
      } else {
        let i = 0

        for (const argument of arguments) {
          if (argument.constructor && argument.constructor.name === 'Mask')
            arguments[i] = argument.data

          i += 1
        }

        result = target[type].apply(target, arguments)
      }

      queue.push({
        data: {
          type,
          value: Array.prototype.slice.call(arguments),
          target,
        },
        observable: target.__observable__,
      })

      return result
    })
)

export default ArrayMask
