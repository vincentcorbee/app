import Element from '../models/Element'
import bindDirectives from './bindDirectives'

const parseHtml = (element, vm) => {
  let node = element.node
  const directives = bindDirectives(element, vm)
  if (
    node.nodeType === 1 &&
    (directives.length === 0 || directives.every(directive => directive.name !== 'for'))
  ) {
    if (node.childNodes) {
      // Create copy
      let childNodes = Array.prototype.slice.call(node.childNodes)

      for (const child of childNodes) {
        const childElement = new Element(child, vm, element)
        // Work around. Prevent elements that are not in the DOM to be added to the Children
        if (element.node.contains(childElement.node)) {
          element.addChild(childElement)
        }
      }
      childNodes = null
    }
  }
  node = null
  return directives
}

export default parseHtml
