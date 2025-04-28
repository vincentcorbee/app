const mapToKeys = (placeholder: string) => {
  const accessor = placeholder.replace(/[{{ *}}]/g, '')
  const keys = accessor.split('.').reduce((acc, entry) => {
    const match = entry.match(/\[[^\]*]\]/)

    const prop = match !== null ? match[0] : null

    if (prop) {
      acc.push(entry.replace(prop, ''), prop.replace(/\[|\]/g, ''))

      return acc
    } else {
      acc.push(entry)

      return acc
    }
  }, [] as string[])

  return keys
}

export default mapToKeys
