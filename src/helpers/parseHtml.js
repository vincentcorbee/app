import Element from '../modules/Element'
import bindDirectives from '../directives/bindDirectives'

const parseHtml = (element, vm, ce) => {
  const { node } = element
  const { nodeType } = node
  const childNodes =
    ce && node.shadowRoot ? [...node.shadowRoot.childNodes] : [...node.childNodes]
  const directives = ce ? [] : bindDirectives(element, vm)

  if (element.toBeRemoved || element.isDetached) {
    return []
  }

  if (
    nodeType == 1 &&
    (directives.length == 0 ||
      directives.every(({ name }) => name !== 'for' && name !== 'if'))
  ) {
    for (const child of childNodes) {
      if (
        !child.parentNode ||
        (child.parentNode && !child.parentNode.contains(child)) ||
        (child.nodeType == 3 && !/\S+/.test(child.data))
      ) {
        continue
      }

      new Element(child, vm, element)
    }
  }

  return directives
}

export default parseHtml
