const _private = new WeakMap<object, any>()

const setPrivate = <Data = any, Target extends object = object>(
  target: Target,
  data: Data
) => _private.set(target, data)

const getPrivate = <Data = any, Target extends object = object>(target: Target): Data => {
  if (!_private.has(target)) throw new Error('Target not attached')

  return _private.get(target)
}

export class PrivateData {
  static attach<Data = any, Target extends object = object>(target: Target, data: Data) {
    setPrivate<Data, Target>(target, data)
  }

  static set<Data extends object, K extends keyof Data, Target extends object = object>(
    target: Target,
    prop: K,
    data: Data[K]
  ): void {
    const privateData = getPrivate<Data>(target)

    privateData[prop] = data
  }

  static get<Data = any, Target extends object = object, Value = Data>(
    target: Target,
    prop?: keyof Data
  ): Value {
    return (prop ? getPrivate<Data, Target>(target)[prop] : getPrivate(target)) as Value
  }
}

export default PrivateData
