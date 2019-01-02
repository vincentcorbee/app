import Element from '../models/Element'

const insertCase = (directive, c) => {
  let element = directive.element
  let node = directive.cases[c].orgNode.cloneNode(true)
  let newElement = new Element(node, directive.vm, element)
  element.addChild(newElement)
  element.node.insertBefore(node, element.node.childNodes[directive.cases[c].index + 1])
  directive.cases[c].element = newElement
  node = null
  newElement = null
  element = null
}

export default insertCase
