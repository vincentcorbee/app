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
    const attributes = 'attributes' in node ? Array.from(node.attributes) : []
    const directives = []

    for (let i = 0, l = attributes.length; i < l; i++) {
      const { name, value } = attributes[i]
      const directive = getDirective({ name, value }, vm)

      if (directive) {
        directive.bind(vNode)
        directives.push(directive)
      }

      if (vNode.toBeRemoved) break
    }

    return directives
  }

  if (nodeType === 3) {
    return getPlaceholders(node as Text).reduce<Directive[]>((acc, placeholder, i) => {
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
