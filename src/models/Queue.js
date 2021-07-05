import Emitter from './Emitter'

const _private = new WeakMap()

export default class Queue extends Emitter {
  constructor() {
    super()

    _private.set(this, {
      buffer: [],
    })
  }

  push(data, observable) {
    const { buffer } = _private.get(this)

    window.setZeroTimeout(() => buffer.push({ data, observable }))

    this.pop()
  }

  pop() {
    const { buffer } = _private.get(this)

    window.setZeroTimeout(() => {
      const obj = buffer.pop()

      obj.observable.notify(obj.data)

      if (!buffer.length) {
        this.emit('flushed')
      }
    })
  }
}
