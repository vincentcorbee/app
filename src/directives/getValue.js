const getValue = (data, obj) => {
  const { identifiers, placeholder } = obj
  const key = identifiers.shift() || null
  const value = key ? data[key] : undefined

  if (value && identifiers.length > 0) {
    obj.identifiers = identifiers

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
