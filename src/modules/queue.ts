import Emitter from './emitter'
import privateData from './private-data'
import Observable from './observable'

export type Update = { observable: Observable; data: any }

type PrivateData = {
  buffer: Array<Update>
}

export default class Queue extends Emitter {
  constructor() {
    super()

    privateData.attach<PrivateData>(this, {
      buffer: [],
    })
  }

  push(update: Update | Array<Update>) {
    const { buffer } = privateData.get<PrivateData>(this)
    const updates = Array.isArray(update) ? update : [update]

    for (let i = 0; i < updates.length; i++) {
      queueMicrotask(() => buffer.push(updates[i]))

      this.pop()
    }
  }

  pop() {
    queueMicrotask(() => {
      const { buffer } = privateData.get(this)
      const { observable, data } = buffer.shift()

      observable.notify(data)

      if (buffer.length === 0) this.emit('flushed')
    })
  }
}
