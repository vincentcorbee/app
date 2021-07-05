import Element from '../models/Element'

const insertCase = (directive, c) => {
  const { cases, element, vm } = directive

  if (!cases) return

  const parent = element.parent

  if (c) {
    const node = directive.cases[c].orgNode.cloneNode(true)
    const newElement = new Element(node, vm)

    cases[c].element = newElement

    directive.element = newElement

    parent.removeChild(element)

    parent.addChild(newElement, cases[c].index + 1)
  } else {
    parent.removeChild(element)
  }
}

export default insertCase
