const getCases = (ifCase, node) => {
  const regElse = /^(a-)?else/
  const regElseIf = /^(a-)?else-if/
  const index = ifCase.index
  const cases = {
    else: null,
    elseif: []
  }
  cases.if = ifCase
  let nextElement = node.nextElementSibling
  while (nextElement && !cases.else) {
    for (const attr of nextElement.attributes) {
      if (regElseIf.test(attr.name)) {
        nextElement.removeAttribute(attr.name)
        cases.elseif.push({
          index,
          element: null,
          orgNode: nextElement.cloneNode(true),
          key: null,
          identifier: null
        })
        nextElement.parentNode.removeChild(nextElement)
        break
      } else if (regElse.test(attr.name)) {
        nextElement.removeAttribute(attr.name)
        cases.else = {
          index,
          element: null,
          orgNode: nextElement.cloneNode(true),
          key: null,
          identifier: null
        }
        nextElement.parentNode.removeChild(nextElement)
        break
      }
    }
    nextElement = nextElement.nextElementSibling
  }
  return cases
}
export default getCases
