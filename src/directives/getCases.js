const getCases = (ifCase, node) => {
  const regIf = /^(a-|\*)?if/
  const regElse = /^(a-|\*)?else/
  const regElseIf = /^(a-|\*)?else-if/
  const { index } = ifCase
  const cases = {
    else: null,
    elseif: [],
    if: ifCase,
  }

  let nextIf = false

  let nextElement = node.nextElementSibling

  const config = {
    index,
    element: null,
    orgNode: null,
    key: null,
    identifier: null,
  }

  while (!nextIf && !cases.else && nextElement) {
    for (const attr of nextElement.attributes) {
      if (regIf.test(attr.name)) {
        nextIf = true

        break
      }

      if (regElseIf.test(attr.name)) {
        nextElement.removeAttribute(attr.name)

        cases.elseif.push({ ...config, orgNode: nextElement.cloneNode(true) })

        nextElement.parentNode.removeChild(nextElement)

        break
      } else if (regElse.test(attr.name)) {
        nextElement.removeAttribute(attr.name)

        cases.else = { ...config, orgNode: nextElement.cloneNode(true) }
        nextElement.parentNode.removeChild(nextElement)

        break
      }
    }

    nextElement = nextElement.nextElementSibling
  }

  /*
    If there are no else or else if cases, create a comment for the else clause.
  */
  if (cases.elseif.length === 0 && cases.else === null) {
    cases.else = {
      ...config,
      orgNode: document.createComment(` { *if=${ifCase.identifier} } `),
    }
  }

  return cases
}

export default getCases
