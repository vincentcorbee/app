import { VNode } from '../modules'
import bindDirectives from '../directives/bind-directives'
import { ComponentInstance } from '../types'

export const parseHtml = (
  vNode: VNode,
  vm: ComponentInstance,
  isCustomElement: boolean
) => {
  if (vNode.toBeRemoved || vNode.isDetached || vNode.isCollected || vNode.node === null)
    return []

  const { node } = vNode
  const { nodeType } = node
  const childNodes =
    isCustomElement && (node as Element).shadowRoot
      ? (node as Element)?.shadowRoot?.childNodes
      : node.childNodes
  const directives = isCustomElement ? [] : bindDirectives(vNode, vm)

  if (
    childNodes &&
    nodeType === 1 &&
    (directives.length === 0 ||
      directives.every(({ name }) => name !== 'for' && name !== 'if'))
  ) {
    let length = childNodes.length
    let div = 0

    for (let i = 0; i + div < length; i++) {
      const child = childNodes[i]

      if (
        !child ||
        !child.parentNode ||
        !child.parentNode.contains(child) ||
        (child.nodeType === 3 && (child as Text).data.trim() === '')
      ) {
        continue
      }

      /* Dirty hack to prevent unwanted traversal */
      // @ts-expect-error
      if (child && child.hasAttribute && child.hasAttribute('*skip')) {
        continue
      }

      VNode.create(child, vm, vNode)

      const currentLength = childNodes.length

      div = currentLength - length
      length = currentLength
    }
  }

  return directives
}

export default parseHtml
