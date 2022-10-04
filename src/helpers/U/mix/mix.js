const copyProperties = (target, source, excludedProps = []) => {
  for (const key of Reflect.ownKeys(source)) {
    if (
      key !== 'constructor' &&
      key !== 'prototype' &&
      key !== 'name' &&
      !excludedProps.includes(key)
    ) {
      const desc = Object.getOwnPropertyDescriptor(source, key)

      Reflect.defineProperty(target, key, desc)
    }
  }
}

const mix = (Mix, ...mixins) => {
  for (const mixin of mixins) {
    copyProperties(Mix, mixin)

    const { prototype } = Mix

    if (prototype) {
      copyProperties(prototype, mixin.prototype)
    } else {
      copyProperties(Mix, mixin.prototype)
    }
  }
}

export default mix
