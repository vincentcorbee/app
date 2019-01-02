const flattenList = arr =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) && !val.type ? acc.concat(flattenList(val)) : acc.concat([val]),
    []
  )
export default flattenList
