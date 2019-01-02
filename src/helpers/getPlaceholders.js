const getPlaceholders = node => {
  let reg = /(\{{+.*\}})/g // /(\{{+[A-z\s.\[\]\d]+\}})/g
  let matches
  let placeholders = []
  while ((matches = reg.exec(node.data)) !== null) {
    let match = matches[0]
    placeholders.push({
      value: match,
      start: matches.index,
      end: matches.index + match.length
    })
  }
  return placeholders
}
export default getPlaceholders
