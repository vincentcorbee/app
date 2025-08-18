import getDirective from './directives'
import getPlaceholders from '../helpers/get-placeholders'
import VNode from '../modules/v-node'
import { ComponentInstance } from '../types'
import { Directive } from '../modules'

const bindDirectives = (vNode: VNode, vm: ComponentInstance) => {
  if (vm.$isDestroyed || vNode.isDetached || vNode.toBeRemoved) return []

  const { node } = vNode
  const { nodeType } = node

  if (nodeType === 1) {
    // Make copy of the attributes
    const attributes = 'attributes' in node ? [...node.attributes] : []
    const directives = []

    for (const { name, value } of attributes) {
      const directive = getDirective({ name, value }, vm)

      if (directive) {
        directive.bind(vNode)
        directives.push(directive)
      }

      if (vNode.toBeRemoved) break
    }

    return directives
  } else if (nodeType === 3) {
    return getPlaceholders(node).reduce<Directive[]>((acc, placeholder, i) => {
      const directive = getDirective(
        {
          name: '*text',
          placeholder,
        },
        vm
      )

      if (!directive) return acc

      if (i === 0) {
        acc.push(directive)

        vNode.node = placeholder.node

        directive.bind(vNode)
      } else {
        directive.bind(VNode.create(placeholder.node, vm, vNode.parent, [directive]))
      }

      return acc
    }, [])
  }

  return []
}

export default bindDirectives
