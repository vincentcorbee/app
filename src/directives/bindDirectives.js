import getDirective from './directives'
import getPlaceholders from '../helpers/getPlaceholders'
import Element from '../models/Element'

const bindDirectives = (element, vm) => {
  if (vm.isDestroyed) return []

  const { node } = element
  const { nodeType } = node

  if (element.isDetached || element.toBeRemoved) {
    return []
  }

  if (nodeType == 1) {
    // Make copy of the attributes
    const attributes = [...node.attributes]
    const directives = []

    for (const { name, value } of attributes) {
      const directive = getDirective({ name, value }, vm)

      if (directive) {
        directive.bind(element, vm)
        directives.push(directive)
      }

      if (element.toBeRemoved) break
    }

    return directives
  } else if (nodeType == 3) {
    return getPlaceholders(node).reduce((acc, placeholder, i) => {
      const directive = getDirective(
        {
          name: 'text',
          placeholder,
        },
        vm
      )

      if (i == 0) {
        acc.push(directive)

        element.node = placeholder.node

        directive.bind(element, vm)
      } else {
        directive.bind(new Element(placeholder.node, vm, element.parent, [directive]), vm)
      }

      return acc
    }, [])
  }

  return []
}

export default bindDirectives
