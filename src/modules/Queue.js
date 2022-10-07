import Emitter from './Emitter'
import { setZeroTimeout } from '@digitalbranch/u'

const _private = new WeakMap()

export default class Queue extends Emitter {
  constructor() {
    super()

    _private.set(this, {
      buffer: [],
    })
  }

  push(args) {
    const { buffer } = _private.get(this)

    const observers = Array.isArray(args) ? args : [args]

    for (const observer of observers) {
      setZeroTimeout(() => buffer.push(observer))

      this.pop()
    }
  }

  pop() {
    const { buffer } = _private.get(this)

    setZeroTimeout(() => {
      const obj = buffer.pop()

      obj.observable.notify(obj.data)

      if (!buffer.length) this.emit('flushed')
    })
  }
}
