//@ts-nocheck
import isType from './is-type'
import copyArray from './copy-array'

export const copyObject = obj => {
  const copy = obj => {
    const copied = Object.create(obj || null)

    for (const [prop, val] of Object.entries(obj)) {
      if (isType('Object', val)) {
        copied[prop] = copy(val)
      } else if (isType('Array', val)) {
        copied[prop] = copyArray(val)
      } else {
        copied[prop] = val
      }
    }

    return copied
  }

  return copy(obj)
}

export default copyObject
