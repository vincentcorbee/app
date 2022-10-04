const getPlaceholders = node => {
  const reg = /\{\{[^}]*\}\}/
  const placeholders = []

  let matches
  let cur = node

  while ((matches = reg.exec(cur.data)) !== null) {
    const value = matches[0]
    const { index } = matches

    cur = cur.splitText(index).splitText(value.length)

    reg.exec(cur.data)

    placeholders.push({
      value,
      node: cur.previousSibling,
    })
  }

  return placeholders
}

export default getPlaceholders
