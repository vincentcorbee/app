import { copyObject } from './../utils'

const _private = new WeakMap()

const setPrivate = (target: any, _data: any) => _private.set(target, copyObject(_data))
const getPrivate = (target: any, _data: any) => {
  if (_private.get(target) == undefined) setPrivate(target, _data)

  return _private.get(target)
}

export class PrivateData {
  attach: (target: any, data: any) => void
  set: (target: any, prop: any, data: any) => void
  get: (target: any, prop?: any) => any

  constructor() {
    let _data: any = null

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
