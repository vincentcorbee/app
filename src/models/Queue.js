import Emitter from './Emitter'

const _private = new WeakMap()

export default class Queue extends Emitter {
  constructor() {
    super()
    const self = this
    _private.set(self, {
      buffer: []
    })
  }
  push(data, observable) {
    const self = this
    const { buffer } = _private.get(self)
    Array.prototype.push.call(buffer, { data, observable })
    self.pop()
  }
  pop() {
    const self = this
    const { buffer } = _private.get(self)
    window.setZeroTimeout(() => {
      let obj = buffer.pop()
      obj.observable.notify(obj.data)
      obj = null
      if (!buffer.length) {
        self.emit('flushed')
      }
    })
  }
}
