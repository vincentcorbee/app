import Emitter from './emitter'
import { setZeroTimeout } from '../utils'
import { privateData } from '.'

export default class Queue extends Emitter {
  constructor() {
    super()

    privateData.attach(this, {
      buffer: [],
    })
  }

  push(args: any) {
    const { buffer } = privateData.get(this)

    const observers = Array.isArray(args) ? args : [args]

    for (const observer of observers) {
      setZeroTimeout(() => buffer.push(observer))

      this.pop()
    }
  }

  pop() {
    const { buffer } = privateData.get(this)

    setZeroTimeout(() => {
      const obj = buffer.pop()

      obj.observable.notify(obj.data)

      if (buffer.length === 0) this.emit('flushed')
    })
  }
}
