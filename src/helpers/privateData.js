import { copyObj } from '../lib/U'

const _private = new WeakMap()
const setPrivate = (target, _data) => _private.set(target, copyObj(_data))
const getPrivate = (target, _data) => {
  if (!_private.get(target)) {
    setPrivate(target, _data)
  }
  return _private.get(target)
}

class PrivateData {
  constructor() {
    let _data = null
    this.attach = (target, data) => {
      _data = data
      setPrivate(target, data)
    }
    this.set = (target, prop, data) => {
      getPrivate(target, _data)[prop] = data
    }
    this.get = (target, prop = null) => {
      return prop ? getPrivate(target, _data)[prop] : getPrivate(target)
    }
  }
}

export const privateData = new PrivateData()
