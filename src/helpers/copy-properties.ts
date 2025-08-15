export const copyProperties = (dest: any, source: any, proxy: any) => {
  const prototype = Object.getPrototypeOf(source)
  const { constructor } = prototype

  if (
    constructor.name !== 'Object' &&
    constructor.name !== 'Array' &&
    constructor.name !== 'Mask' &&
    constructor.name !== 'ArrayMask'
  ) {
    copyProperties(dest, prototype, proxy)
  }

  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype') {
      Reflect.defineProperty(dest, key, {
        enumerable: Reflect.getOwnPropertyDescriptor(source, key)?.enumerable,
        get() {
          // should bind to the original object or Mask ?
          return typeof source[key] === 'function' ? proxy[key].bind(dest) : proxy[key]
        },
        set(value) {
          return Reflect.set(proxy, key, value, proxy)
        },
      })
    }
  }
}
export default copyProperties
