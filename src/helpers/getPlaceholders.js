const getPlaceholders = node => {
  const reg = /(\{{+.*\}})/g // /(\{{+[A-z\s.\[\]\d]+\}})/g
  const placeholders = []

  let matches

  while ((matches = reg.exec(node.data)) !== null) {
    const value = matches[0]

    placeholders.push({
      value,
      start: matches.index,
      end: matches.index + value.length,
    })
  }

  return placeholders
}

export default getPlaceholders
