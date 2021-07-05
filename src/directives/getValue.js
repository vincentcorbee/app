const getValue = (data, obj) => {
  const { identifiers: arr, placeholder } = obj
  const key = arr.shift() || null
  const value = key ? data[key] : undefined

  if (value && arr.length > 0) {
    obj.identifiers = arr
    return getValue(value, obj)
  } else {
    return {
      value,
      data,
      key,
      placeholder,
    }
  }
}

export default getValue
