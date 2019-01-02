import { copyObj } from '../lib/U'

const _data = {
  observers: []
}
// This has to be in a generic private object
const _private = new WeakMap()
const setPrivate = inst => _private.set(inst, copyObj(_data))
const getPrivate = inst => {
  if (!_private.get(inst)) {
    setPrivate(inst)
  }
  return _private.get(inst)
}

export default class Observable {
  constructor(...args) {
    const self = this
    setPrivate(self)
    Reflect.defineProperty(self, '__observers__', {
      value: getPrivate(self).observers
    })
    while (args.length) {
      self.subscribe(args.splice(0, 2))
    }
  }
  subscribe(observer, prop) {
    // This does not work, to many observers are being added
    const self = this
    const { observers } = getPrivate(self)
    if (
      observers.every(o => {
        if (o[0] === observer) {
          if (o[1] === prop) {
            return false
          }
          return true
        }
        return true
      })
    ) {
      observers.push([observer, prop])
      return true
    }
    return false
  }
  unsubscribe(observer) {
    const self = this
    let { observers } = getPrivate(self)
    const length = observers.length
    observers = observers.filter(obj => obj[0] !== observer)
    getPrivate(self).observers = observers
    return observers.length < length
  }
  notify(data) {
    const self = this
    const { observers } = getPrivate(self)
    observers.forEach(observer => {
      if (!data.prop) {
        observer[0].update(data)
      } else if (observer[1]) {
        if (observer[1] === data.prop) {
          observer[0].update(data)
        }
      }
    })
    return self
  }
}
