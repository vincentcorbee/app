import getDirective from './directives'
import getPlaceholders from '../helpers/getPlaceholders'

// const bind = (directive, element, vm) => () => {
//   directive.bind(element, vm)
//   return directive
// }

const bindDirectives = (element, vm) => {
  const node = element.node
  const { nodeType } = node

  // console.log(node)

  if (element.isDetached || element.toBeRemoved) {
    return []
  }

  if (nodeType === 1) {
    // Make copy
    const attributes = [...node.attributes]
    const directives = []

    for (const { name, value } of attributes) {
      const directive = getDirective({ name, value })

      if (directive) {
        directive.bind(element, vm)
        directives.push(directive)
        // directives.push(bind(directive, element, vm))
      }

      if (element.toBeRemoved) break
    }

    return directives
  } else if (nodeType === 3) {
    return getPlaceholders(node).map(placeholder => {
      const directive = getDirective({
        name: 'text',
        placeholder
      })

      directive.bind(element, vm)

      return directive
      // return bind(directive, element, vm)
    })
  }

  return []
}

export default bindDirectives
