import isMask from './is-mask'
import isArrayMask from './is-array-mask'
import attachObservable from './attach-observable'

const getSourceValue = (value: any, observer: any) => {
  if (!value) return value

  if (Array.isArray(value)) {
    for (let i = 0, l = value.length; i < l; i++) {
      const item = value[i]
      const { constructor } = Object.getPrototypeOf(item)

      if (isMask(constructor)) {
        value[i] = getSourceValue(item.data, item.__observable__)
      } else if (isArrayMask(constructor)) {
        value[i] = getSourceValue(item.data, item.__observable__)
      } else {
        value[i] = item
      }
    }
  } else if (isMask(Object.getPrototypeOf(value))) {
    value = value.data
  }

  if (observer) attachObservable(value, observer)

  return value
}

export default getSourceValue
