import getDirective from '../directives/getDirectives'
import getPlaceholders from './getPlaceholders'

const bindDirectives = (element, vm) => {
  let node = element.node
  let directives = []
  if (node.nodeType === 1) {
    // Make copy
    let attributes = Array.prototype.slice.call(node.attributes)
    for (const attr of attributes) {
      let directive = getDirective(attr)
      if (directive) {
        directive.bind(element, vm)
        directives.push(directive)
      }
    }
    attributes = null
  } else if (node.nodeType === 3) {
    getPlaceholders(node).forEach(placeholder => {
      let directive = getDirective({
        name: 'text',
        placeholder: placeholder
      })
      directive.bind(element, vm)
      directives.push(directive)
    })
    node = null
  }
  return directives
}
export default bindDirectives
