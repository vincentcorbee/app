export const getPlaceholders = (node: Text) => {
  const reg = /\{{2}.*?\}{2}/
  const placeholders = []

  let matches
  let cur = node

  while ((matches = reg.exec(cur.data)) !== null) {
    const value = matches[0]
    const { index } = matches

    cur = cur.splitText(index).splitText(value.length)

    placeholders.push({
      value,
      node: cur.previousSibling as Node | null,
    })
  }

  return placeholders
}

export default getPlaceholders
