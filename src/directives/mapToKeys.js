const mapToKeys = placeholder => {
  const identifier = placeholder.replace(/[{{ *}}]/g, '')
  const keys = identifier
    .split('.')
    .map(entry => {
      let prop = entry.match(/\[[^\]*]\]/)
      prop = prop !== null ? prop[0] : null
      if (prop) {
        entry = entry.replace(prop, '')
        prop = prop.replace(/\[|\]/g, '')
        return [entry, prop]
      } else {
        return entry
      }
    })
    .reduce((acc, val) => acc.concat(val), [])
  return {
    keys,
    identifier
  }
}
export default mapToKeys
