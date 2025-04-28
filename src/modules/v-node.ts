import { isType, removeListener } from '../utils'
import { parseHtml } from '../helpers'
import Emitter from './emitter'
import Collector from './collector'
import Directive from './directive'
import { ComponentInstance } from '../types'

type Private<T extends Node = Node | Element> = {
  node: T | null
  parent: VNode | null
  vm: ComponentInstance | null
  directives: Directive[]
  children?: VNode[]
}

const _private = new WeakMap<VNode, Private>()

let __id__ = 0

const __collector__ = new Collector()

export default class VNode<
  T extends Node = Node | Element | HTMLElement
> extends Emitter {
  id: number
  isDetached: boolean
  isCollected: boolean
  children?: VNode[]
  toBeRemoved = false
  eventListeners?: Record<string, any> | null = null

  constructor(
    el: T | string,
    vm: ComponentInstance,
    parent: VNode | null = null,
    directives: Directive[] = [],
    isCustomElement = false
  ) {
    super()

    this.id = __id__++
    this.isDetached = false
    this.isCollected = false

    __collector__.updateCount(1)

    const self = this
    const node: Node | null = isType('String', el)
      ? document.querySelector(el as string)
      : isType('Node', el)
      ? (el as Node)
      : null

    __collector__.on('collect', this.#collectGarbage, this)

    __collector__.start()

    _private.set(this, {
      node,
      parent,
      vm,
      directives,
    })

    if (node && node.nodeType !== 3) {
      this.eventListeners = {}

      _private.get(this)!.children = []

      Reflect.defineProperty(this, 'children', {
        get() {
          return self.#getPrivate().children
        },
      })

      if (this.children) {
        this.children.push = function () {
          const { children } = self.#getPrivate()

          if (!self.isDetached) {
            Array.prototype.push.apply(children, Array.from(arguments))
          }

          return children!.length
        }
      }
    }

    if (parent) parent.addChild(this)

    if (directives.length) {
      this.#getPrivate().directives = directives
    } else {
      this.#getPrivate().directives = parseHtml(this, vm, isCustomElement)
    }

    if (this.children) {
      this.children.forEach(child => child.toBeRemoved && this.removeChild(child))
    }
  }

  #collectGarbage = (el: VNode) => {
    if (!el.isCollected && el.isDetached && (!el.children || !el.children.length)) {
      el.isCollected = true

      __collector__.off('collect', this.#collectGarbage)
    } else if (el && (!el.node || (el.node && !el.node.parentNode))) {
      el.$destroy()
    }
  }

  $destroy() {
    const { parent, children } = this

    if (parent && parent.children?.includes(this)) {
      parent.removeChild(this)
    } else {
      this.detach()

      if (children) children.forEach(child => this.removeChild(child))
    }
  }

  get vm() {
    return this.#getPrivate().vm
  }

  set vm(vm) {
    this.#getPrivate().vm = vm
  }

  get parent() {
    return this.#getPrivate().parent
  }

  set parent(parent: VNode | null) {
    this.#getPrivate().parent = parent
  }

  get node() {
    return this.#getPrivate().node as T
  }

  get directives() {
    return this.#getPrivate().directives
  }

  set node(node) {
    this.#getPrivate().node = node
  }

  // This may not work correctly
  get nextSibling(): VNode | null {
    const parent = this.parent

    if (parent) {
      const children = parent.children

      if (children) {
        const length = children.length
        const index = children.indexOf(this)

        if (index < length && index !== 0 && length !== 1) return children[index + 1]
      }
    }

    return null
  }

  // This may not work correctly
  get previousSibling(): VNode | null {
    const parent = this.parent

    if (parent) {
      const children = parent.children

      if (children) {
        const index = children.indexOf(this)

        if (index > 1) return children[index - 1]
      }
    }

    return null
  }

  detach() {
    const { node, isDetached } = this

    if (isDetached) return

    this.#getPrivate().directives = []

    if (this.eventListeners) {
      const entries = Object.entries(this.eventListeners)

      for (const [event, [listener, parent]] of entries) {
        removeListener(this.node, event, listener)

        if (parent) parent.off(event, listener)
      }

      this.eventListeners = null
    }

    if (node && node.parentNode) node.parentNode.removeChild(node)

    this.parent = null
    this.vm = null
    this.isDetached = true

    this.emit('detached')

    this.#getPrivate().node = null

    __collector__.updateCount(-1)
  }

  removeChild(child: VNode | number, count = 1) {
    const { children } = this

    if (!children) return

    const index = typeof child !== 'number' ? children.indexOf(child) : child

    if (index > -1) {
      const removed = children.splice(index, count)

      for (const el of removed) {
        const { children } = el

        el.detach()

        if (children) children.forEach(child => el.removeChild(child))
      }
    }
  }

  replaceChild(oldChild: VNode, newChild: VNode) {
    const { children } = this

    if (!children) return

    const index = children.indexOf(oldChild)

    if (index > -1) {
      const { node } = this

      if (!node) return

      const root = node.shadowRoot || node

      children[index] = newChild

      if (root && root.contains(oldChild.node))
        root.replaceChild(newChild.node!, oldChild.node!)

      if (oldChild.children) {
        oldChild.children.forEach(child => oldChild.removeChild(child))
      }
    }
  }

  removeLastChild() {
    const { children = [] } = this
    const length = children.length

    if (length) this.removeChild(children[length - 1])
  }

  removeFirstChild() {
    const { children = [] } = this

    if (children.length) this.removeChild(children[0])
  }

  /* This is not reliable for adding a node directly as the current node does not have to be it's parent */

  addChild(childElement: VNode, index = null, parentNode = null) {
    const { children, node } = this
    const childNode = childElement.node

    if (!childNode || !node) return

    const root = parentNode || node.shadowRoot || node

    if (children && children.indexOf(childElement) === -1) {
      childElement.parent = this

      children.push(childElement)

      if (!root.contains(childNode) && !node?.contains(childNode)) {
        const docFrag = document.createDocumentFragment()

        if (!index) {
          root.appendChild(docFrag.appendChild(childNode))
        } else {
          root.insertBefore(docFrag.appendChild(childNode), root.childNodes[index])
        }
      }
    }
  }

  #getPrivate(): Private<T> {
    return _private.get(this) as Private<T>
  }
}
