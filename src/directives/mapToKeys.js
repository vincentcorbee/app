const mapToKeys = placeholder => {
  const accessor = placeholder.replace(/[{{ *}}]/g, '')
  const keys = accessor.split('.').reduce((acc, entry) => {
    let prop = entry.match(/\[[^\]*]\]/)

    prop = prop !== null ? prop[0] : null

    if (prop) {
      acc.push(entry.replace(prop, ''), prop.replace(/\[|\]/g, ''))

      return acc
    } else {
      acc.push(entry)

      return acc
    }
  }, [])

  return {
    keys,
    identifier: keys[keys.length - 1],
    base: keys[0],
    accessor,
  }
}

export default mapToKeys
