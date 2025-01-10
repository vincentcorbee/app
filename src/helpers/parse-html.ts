import { VNode } from '../modules'
import bindDirectives from '../directives/bind-directives'
import { ComponentInstance } from '../types'

const parseHtml = (vNode: VNode, vm: ComponentInstance, isCustomElement: boolean) => {
  if (vNode.toBeRemoved || vNode.isDetached) return []

  const { node } = vNode
  const { nodeType } = node
  const childNodes =
    isCustomElement && node.shadowRoot
      ? [...node.shadowRoot.childNodes]
      : [...node.childNodes]
  const directives = isCustomElement ? [] : bindDirectives(vNode, vm)

  if (
    nodeType === 1 &&
    (directives.length === 0 ||
      directives.every(({ name }) => name !== 'for' && name !== 'if'))
  ) {
    for (let i = 0, l = childNodes.length; i < l; i++) {
      const child = childNodes[i]

      if (
        !child.parentNode ||
        !child.parentNode.contains(child) ||
        (child.nodeType === 3 && !/\S+/.test(child.data))
      ) {
        continue
      }

      new VNode(child, vm, vNode)
    }
  }

  return directives
}

export default parseHtml
