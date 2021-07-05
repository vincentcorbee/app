import Element from '../models/Element'
import bindDirectives from '../directives/bindDirectives'

const parseHtml = (element, vm) => {
  const node = element.node
  const { nodeType } = node
  const childNodes = node.shadowRoot
    ? [...node.shadowRoot.childNodes]
    : [...node.childNodes]
  const directives = bindDirectives(element, vm)

  // console.log(node, element)

  if (element.toBeRemoved || element.isDetached) {
    return []
  }

  // console.trace(node, childNodes)

  if (
    nodeType === 1 &&
    (directives.length === 0 ||
      directives.every(({ name }) => name !== 'for' && name !== 'if'))
  ) {
    for (const child of childNodes) {
      if (!child.parentNode || (child.parentNode && !child.parentNode.contains(child))) {
        continue
      }

      if (child.nodeType === 3 && !/\S+/.test(child.data)) {
        continue
      }

      // console.log(child, child.parentNode.innerHTML, child.parentNode.contains(child))
      new Element(child, vm, element)
    }
  }

  return directives
}

export default parseHtml
