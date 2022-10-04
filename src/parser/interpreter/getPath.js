const getPath = arr =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) && (!val.type || val.type === 'accessor')
        ? acc.concat(getPath(val))
        : acc.concat([val]),
    []
  )

export default getPath
