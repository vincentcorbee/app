import { Directive, VNode } from '../modules'

export type Case = 'if' | 'else'

const insertCase = (directive: Directive, c: Case) => {
  const { cases, vNode, vm } = directive

  if (!cases) return

  const parent = vNode.parent

  if (c) {
    const { parentNode, orgNode } = cases[c]
    const node = orgNode.cloneNode(true)
    const newVNode = VNode.create(node, vm)

    cases[c].vNode = newVNode
    directive.vNode = newVNode

    parent.removeChild(vNode)
    parent.addChild(newVNode, cases[c].index + 1, parentNode)
  } else {
    parent.removeChild(vNode)
  }
}

export default insertCase
