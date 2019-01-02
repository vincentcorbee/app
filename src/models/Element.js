import { isType } from '../lib/U'
import parseHtml from '../helpers/parseHtml'
import Emitter from './Emitter'

const _private = new WeakMap()

export default class Element extends Emitter {
  constructor(el, vm, parent = null) {
    super()
    const self = this
    let directives = []
    // const detach = self => {
    //   const { directives } = _private.get(self)
    //   directives.forEach(directive =>
    //     directive.observables.forEach(observable => observable.unsubscribe(directive))
    //   )
    //   _private.get(self).directives = []
    // }
    const node = isType('String', el)
      ? document.querySelector(el)
      : isType('Node', el)
      ? el
      : null
    // if (parent) {
    //   const mutationObserver = new MutationObserver(mutations =>
    //     mutations.forEach(mutation => {
    //       for (const removed of mutation.removedNodes) {
    //         if (removed === node && self.toBeRemoved) {
    //           // self.detach()
    //           // removeObservable(self)
    //           break
    //         }
    //       }
    //     })
    //   )
    //   mutationObserver.observe(parent.node, {
    //     childList: true
    //   })
    // }
    _private.set(self, {
      node,
      parent,
      vm,
      directives
    })
    if (node && node.nodeType !== 3) {
      self.listeners = {}
      _private.get(self).children = []
      Reflect.defineProperty(self, 'children', {
        value: _private.get(self).children
      })
    }
    // Why does this uses parseHtml
    _private.get(self).directives = directives.concat(parseHtml(self, vm))
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
  set node(node) {
    _private.get(this).node = node
    return this
  }
  // This may not work correctly
  get nextSibling() {
    const self = this
    const parent = self.parent
    let sibling = null
    if (parent) {
      const children = parent.children
      const length = children.length
      const index = children.indexOf(self)
      if (index < length) {
        sibling = children[index + 1]
      }
    }
    return sibling
  }
  // This may not work correctly
  get previousSibling() {
    const self = this
    const parent = self.parent
    let sibling = null
    if (parent) {
      const children = parent.children
      const index = children.indexOf(self)
      if (index > 0) {
        sibling = children[index - 1]
      }
    }
    return sibling
  }
  detach() {
    const { directives } = _private.get(this)
    _private.get(this).directives = directives.filter(directive => {
      directive.element = null
      // if (directive.attachedData) {
      //   directive.attachedData.delete(this.node)
      //   directive.attachedData = null
      // }
      directive.observables = directive.observables.filter(observable =>
        observable.unsubscribe(directive)
      )
      return false
    })
  }
  removeChild(child) {
    const self = this
    const index = self.children.findIndex(element => element === child)
    let removed = []
    if (index > -1) {
      removed = self.children.splice(index, 1)
      for (const el of removed) {
        el.detach()
        if (
          el.node.parentNode.parentNode &&
          el.node.parentNode.parentNode.contains(el.node.parentNode)
        ) {
          el.node.parentNode.removeChild(el.node)
        }
        el.node = null
        el.parent = null
        el.vm = null
        if (el.children && el.children.length) {
          el.children.forEach(child => el.removeChild(child))
        }
      }
    }
    removed = null
  }
  removeLastChild() {
    const children = this.children
    const length = this.children.length
    if (length) {
      this.removeChild(children[length - 1])
    }
  }
  removeFirstChild() {
    const children = this.children
    const length = this.children.length
    if (length) {
      this.removeChild(children[0])
    }
  }
  addChild(child) {
    child.parent = this
    this.children.push(child)
    // this.node.appendChild(child.node)
  }
}
