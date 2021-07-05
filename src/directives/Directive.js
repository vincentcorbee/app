import Emitter from '../models/Emitter'

const __destroy__ = self => self.unbind()
const _private = new WeakMap()

class Directive extends Emitter {
  static __count__ = 0

  constructor(name, reg, attr, bind, update) {
    super()

    _private.set(this, {
      name,
      reg,
      bind,
      update,
      attr,
      element: undefined,
      isBound: false,
      isDestroyed: false,
      attachedData: new WeakMap(),
      expression: undefined,
      orgNode: undefined,
      placeholder: undefined,
      key: undefined,
      attributeName: undefined,
      identifier: undefined,
      cases: undefined,
      observables: [],
    })

    Directive.__count__++
  }

  update(data) {
    if (this.isDestroyed || !this.element || (this.element && this.element.isDetached)) {
      if (data.target && data.target.__observable__) {
        return data.target.__observable__.unsubscribe(this)
      }
    }

    _private.get(this).update.call(this, data)
  }

  bind(element, vm) {
    if (this.isDestroyed) return

    _private.get(this).bind.call(this, element, vm)

    this.isBound = this.isBound || true
  }

  unbind() {
    if (this.isDestroyed) return false

    if (this.attachedData) {
      this.attachedData.delete(this.node)
    }

    _private.get(this).observables = []
    _private.get(this).attr = null
    _private.get(this).element = null
    _private.get(this).orgNode = null
    _private.get(this).vm = null
    _private.get(this).cases = null
    _private.get(this).isDestroyed = true
    _private.get(this).isBound = false

    this.emit('unbind')

    Directive.__count__--

    return false
  }

  get isDestroyed() {
    return _private.get(this).isDestroyed
  }

  get name() {
    return _private.get(this).name
  }

  get reg() {
    return _private.get(this).reg
  }

  get attr() {
    return _private.get(this).attr
  }

  get observables() {
    return _private.get(this).observables
  }

  get expression() {
    return _private.get(this).expression
  }

  get vm() {
    return _private.get(this).vm
  }

  get element() {
    return _private.get(this).element
  }

  get orgNode() {
    return _private.get(this).orgNode
  }

  get placeholder() {
    return _private.get(this).placeholder
  }

  get key() {
    return _private.get(this).key
  }

  get identifier() {
    return _private.get(this).identifier
  }

  get attributeName() {
    return _private.get(this).attributeName
  }

  get cases() {
    return _private.get(this).cases
  }

  get attachedData() {
    return _private.get(this).attachedData
  }

  get isBound() {
    return _private.get(this).isBound
  }

  set isBound(bool) {
    return (_private.get(this).isBound = bool)
  }

  set reg(reg) {
    return (_private.get(this).reg = reg)
  }

  set name(name) {
    return (_private.get(this).name = name)
  }

  set observables(observables) {
    return (_private.get(this).observables = observables)
  }

  set expression(expression) {
    return (_private.get(this).expression = expression)
  }

  set vm(vm) {
    return (_private.get(this).vm = vm)
  }

  set element(newElement) {
    if (this.isDestroyed) return false

    const { element } = this

    if (element) {
      element.off('detached', __destroy__)
    }

    newElement.on('detached', __destroy__, this)

    return (_private.get(this).element = newElement)
  }

  set orgNode(orgNode) {
    return (_private.get(this).orgNode = orgNode)
  }

  set placeholder(placeholder) {
    return (_private.get(this).placeholder = placeholder)
  }

  set key(key) {
    return (_private.get(this).key = key)
  }

  set identifier(identifier) {
    return (_private.get(this).identifier = identifier)
  }

  set attributeName(attributeName) {
    return (_private.get(this).attributeName = attributeName)
  }

  set cases(cases) {
    return (_private.get(this).cases = cases)
  }
}

export default Directive
