const camelToHyphen = (str: string) =>
  str.replace(
    /[A-Z]/g,
    (match, offset) => `${offset > 0 ? '-' : ''}${match.toLowerCase()}`
  )
export default camelToHyphen
