import isType from '../is-type/is-type'
import copyObject from '../copy-object/copy-object'

const copyArray = arr => {
  const copy = () => {
    const copied = []
    const l = arr.length
    let i = 0

    while (i < l) {
      if (isType('Array', arr[i])) {
        copied[i] = copy[arr[i]]
      } else if (isType('Object', arr[i])) {
        copied[i] = copyObject(arr[i])
      } else {
        copied[i] = arr[i]
      }
      i += 1
    }
    // Copy any methods and properties added to instance of array
    for (const prop in arr) {
      if (arr.hasOwnProperty(prop) && !/^\d$/.test(prop)) {
        copied[prop] = arr[prop]
      }
    }

    return copied
  }
  return copy(arr)
}

export default copyArray
