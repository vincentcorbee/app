import { App, VNode } from '../modules'
import bindDirectives from '../directives/bind-directives'
import { ComponentInstance } from '../types'

export const parseHtml = (
  vNode: VNode,
  vm: ComponentInstance,
  isCustomElement: boolean
) => {
  if (vNode.toBeRemoved || vNode.isDetached) return []

  const { node } = vNode
  const { nodeType } = node
  const childNodes =
    isCustomElement && (node as Element).shadowRoot
      ? (node as Element)?.shadowRoot?.childNodes
      : node.childNodes
  const directives = isCustomElement ? [] : bindDirectives(vNode, vm)

  // console.log(node, isCustomElement, directives, (node as Element)?.shadowRoot)

  if (
    childNodes &&
    nodeType === 1 &&
    (directives.length === 0 ||
      directives.every(({ name }) => name !== 'for' && name !== 'if'))
  ) {
    for (let i = 0, l = childNodes.length; i < l; i++) {
      const child = childNodes[i]

      if (
        !child ||
        !child.parentNode ||
        !child.parentNode.contains(child) ||
        (child.nodeType === 3 && (child as Text).data.trim() === '')
      ) {
        continue
      }

      VNode.create(child, vm, vNode)
    }
  }

  return directives
}

export default parseHtml
