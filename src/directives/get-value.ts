const getValue = (src: any, identifiers: string[]) => {
  const key = identifiers.shift() || ''
  const value = key ? src[key] : undefined

  if (value && identifiers.length > 0) {
    return getValue(value, identifiers)
  } else {
    return {
      value,
      data: src,
      key,
    }
  }
}

export default getValue
