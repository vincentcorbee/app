import { copyObject } from './U'

const _private = new WeakMap()

const setPrivate = (target, _data) => _private.set(target, copyObject(_data))
const getPrivate = (target, _data) => {
  if (_private.get(target) == undefined) {
    setPrivate(target, _data)
  }

  return _private.get(target)
}

export class PrivateData {
  constructor() {
    let _data = null

    this.attach = (target, data) => {
      _data = data

      setPrivate(target, data)
    }

    this.set = (target, prop, data) => (getPrivate(target, _data)[prop] = data)

    this.get = (target, prop = null) =>
      prop ? getPrivate(target, _data)[prop] : getPrivate(target, _data)
  }
}

const privateData = new PrivateData()

export default privateData
