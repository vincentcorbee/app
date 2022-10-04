import isType from '../is-type/is-type'
import copyArray from '../copy-array/copy-array'

const copyObject = obj => {
  const copy = obj => {
    const copied = Object.create(obj || null)

    for (const [prop, val] of Object.entries(obj)) {
      // console.log(prop, val)
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
