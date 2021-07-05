import { isType, removeListener } from '../helpers/U'
import parseHtml from '../helpers/parseHtml'
import Emitter from './Emitter'

const _private = new WeakMap()
let __id__ = 0
let __count__ = 0
// const __TREE__ = []

class Collector extends Emitter {
  constructor() {
    super()
    this.count = 0
    this.isCollecting = false
  }

  start() {
    if (this.isCollecting) return

    this.isCollecting = true

    setZeroTimeout(() => {
      // console.log(this.count)
      if (this.count !== __count__) {
        this.count = __count__

        this.emit('collect')

        this.isCollecting = false

        return this.start()
      }

      this.isCollecting = false
    })
  }
}

const __collector__ = new Collector()

export default class Element extends Emitter {
  constructor(el, vm, parent = null) {
    super()

    this.id = __id__++
    this.isDetached = false
    this.isCollected = false

    __count__++

    const collectGarbage = el => {
      if (!el.isCollected && el.isDetached && (!el.children || !el.children.length)) {
        el.isCollected = true

        __collector__.off('collect', collectGarbage)
      } else if (el && (!el.node || (el.node && !el.node.parentNode))) {
        el.$destroy()
      }
    }
    const self = this
    const directives = []
    const node = isType('String', el)
      ? document.querySelector(el)
      : isType('Node', el)
      ? el
      : null

    __collector__.on('collect', collectGarbage, self)

    __collector__.start()

    _private.set(self, {
      node,
      parent,
      vm,
      directives,
    })

    if (node && node.nodeType !== 3) {
      self.eventListeners = {}

      _private.get(self).children = []

      Reflect.defineProperty(self, 'children', {
        value: _private.get(self).children,
      })

      self.children.push = function () {
        const { children } = _private.get(self)

        if (!self.isDetached) {
          Array.prototype.push.apply(children, arguments)
        }

        return children.length
      }
    }

    if (parent) {
      parent.addChild(self)
    }

    if (self.node) {
      // console.dir(node.isCustomElement, node)
      // console.dir(self.node)
    }

    _private.get(self).directives = directives.concat(parseHtml(self, vm))

    if (self.children) {
      self.children.forEach(child => {
        if (child.toBeRemoved) {
          self.removeChild(child)
        }
      })
    }

    // console.log(__id__)
  }

  $destroy() {
    const { parent, children } = this

    if (parent && parent.children.indexOf(this) > -1) {
      parent.removeChild(this)
    } else {
      this.detach()

      if (children) {
        children.forEach(child => this.removeChild(child))
      }
    }
  }

  get vm() {
    return _private.get(this).vm
  }
  set vm(vm) {
    _private.get(this).vm = vm
  }
  get parent() {
    return _private.get(this).parent
  }
  set parent(parent) {
    _private.get(this).parent = parent
    return this
  }
  get node() {
    return _private.get(this).node
  }
  get directives() {
    return _private.get(this).directives
  }
  set node(node) {
    _private.get(this).node = node

    return this
  }
  // This may not work correctly
  get nextSibling() {
    const self = this
    const parent = self.parent

    if (parent) {
      const children = parent.children
      const length = children.length
      const index = children.indexOf(self)

      if (index < length && index !== 0 && length !== 1) {
        return children[index + 1]
      }
    }

    return null
  }
  // This may not work correctly
  get previousSibling() {
    const self = this
    const parent = self.parent

    if (parent) {
      const children = parent.children
      const index = children.indexOf(self)

      if (index > 1) {
        return children[index - 1]
      }
    }

    return null
  }

  detach() {
    if (this.isDetached) return

    // const { directives } = _private.get(this)

    // _private.get(this).directives = directives.filter(directive => directive.$destroy())

    _private.get(this).directives = []

    if (this.eventListeners) {
      const entries = Object.entries(this.eventListeners)

      for (const [event, [listener, parent]] of entries) {
        removeListener(this.node, event, listener)

        if (parent) {
          parent.off(event, listener)
        }
      }

      this.eventListeners = {}
    }

    this.node = null
    this.parent = null
    this.vm = null
    this.isDetached = true

    this.emit('detached')

    __count__--
  }

  removeChild(child, c = 1) {
    const self = this
    const { children } = self
    const index = isNaN(child) ? children.indexOf(child) : child

    if (index > -1) {
      const removed = children.splice(index, c)

      // console.log(removed)

      for (const el of removed) {
        const { node, children } = el

        el.detach()

        if (node && node.parentNode && node.parentNode.contains(node)) {
          node.parentNode.removeChild(node)
        }

        if (children) {
          children.forEach(child => el.removeChild(child))
        }
      }
    }
  }

  replaceChild(oldChild, newChild) {
    const index = this.children.indexOf(oldChild)

    if (index > -1) {
      let { children, node } = this

      node = node.shadowRoot || node

      children[index] = newChild

      if (node && node.contains(oldNode.node)) {
        node.replaceChild(newChild.node, oldChild.node)
      }

      if (oldChild.children) {
        oldChild.children.forEach(child => el.removeChild(child))
      }
    }
  }

  removeLastChild() {
    const children = this.children
    const length = children.length

    if (length) {
      this.removeChild(children[length - 1])
    }
  }

  removeFirstChild() {
    const { children } = this

    if (children.length) {
      this.removeChild(children[0])
    }
  }

  addChild(child, index = null) {
    let { children, node } = this
    const childNode = child.node

    node = node.shadowRoot || node

    // console.log(node)

    if (children.indexOf(child) === -1) {
      child.parent = this

      children.push(child)

      if (!node.contains(childNode)) {
        const docFrag = document.createDocumentFragment()

        if (!index) {
          node.appendChild(docFrag.appendChild(childNode))
        } else {
          node.insertBefore(docFrag.appendChild(childNode), node.childNodes[index])
        }
      }
    }
  }
}
