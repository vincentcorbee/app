import isMask from './isMask'
import isArrayMask from './isArrayMask'
import attachObservable from './attachObservable'

const getSourceValue = (value, ob) => {
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
    // value = value.map(item => {
    //   const { constructor } = Object.getPrototypeOf(item)

    //   if (constructor && constructor.name === 'Mask') {
    //     return getSourceValue(item.data, item.__observable__)
    //   } else if (constructor && constructor.name === 'ArrayMask') {
    //     return getSourceValue(item.data, item.__observable__)
    //   }

    //   return item
    // })
  } else if (isMask(Object.getPrototypeOf(value))) {
    value = value.data
  }

  if (ob) {
    attachObservable(value, ob)

    // ob.value = value
  }

  return value
}

export default getSourceValue
