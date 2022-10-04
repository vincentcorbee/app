const flattenList = arr =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) && !val.type ? [...acc, ...flattenList(val)] : [...acc, val],
    []
  )

export default flattenList
