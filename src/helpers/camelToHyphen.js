const camelToHyphen = str =>
  str.replace(
    /[A-Z]/g,
    (match, offset) => `${offset > 0 ? '-' : ''}${match.toLowerCase()}`
  )
export default camelToHyphen
