const copyProperties = (dest, source, proxy) => {
  const prototype = Object.getPrototypeOf(source)

  if (
    prototype.constructor.name !== 'Object' &&
    prototype.constructor.name !== 'Array' &&
    prototype.constructor.name !== 'Mask' &&
    prototype.constructor.name !== 'ArrayMask'
  ) {
    copyProperties(dest, prototype, proxy)
  } else {
    for (const key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype') {
        Reflect.defineProperty(dest, key, {
          enumerable: Reflect.getOwnPropertyDescriptor(source, key).enumerable,
          get() {
            return proxy[key]
          },
          set(value) {
            return Reflect.set(proxy, key, value, proxy)
          }
        })
      }
    }
  }
}
export default copyProperties
