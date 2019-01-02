const getValue = (data, obj) => {
  let arr = obj.identifiers
  let placeholder = obj.placeholder
  let key = arr.shift() || null
  let value = key ? data[key] : undefined
  if (value && arr.length > 0) {
    obj.identifiers = arr
    return getValue(value, obj)
  } else {
    return {
      value,
      data,
      key,
      placeholder
    }
  }
}
export default getValue
