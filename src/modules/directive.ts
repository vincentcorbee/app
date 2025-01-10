import Emitter from './emitter'
import Observable from './observable'
import VNode from './v-node'

const _private = new WeakMap()

class Directive extends Emitter {
  static __count__ = 0

  id: number

  constructor(name: string, regExp: RegExp, attr: any, bind: any, update: any, vm: any) {
    super()

    _private.set(this, {
      name,
      reg: regExp,
      bind,
      update,
      attr,
      vm,
      vNode: undefined,
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
      metaData: {},
    })

    Directive.__count__++

    this.#setExpressionAndVm(
      attr.value || attr.placeholder.value.replace(/^{{|}}$/g, '').trim()
    )

    this.vm.on('destroy', this.$destroy)

    this.id = Directive.__count__
  }

  #setExpressionAndVm(expression: string) {
    const regParent = /\$parent\.?/

    if (regParent.test(expression)) {
      expression = expression.replace(regParent, () => {
        this.vm = this.vm.$parent

        return ''
      })
    }

    this.expression = expression
  }

  update(data?: any) {
    if (this.isDestroyed || !this.vNode || (this.vNode && this.vNode.isDetached)) {
      if (data.target && data.target.__observable__) {
        data.target.__observable__.unsubscribe(this)

        this.off('unbind', data.target.__observable__.unsubscribe)
      }
    } else if (!this.vm || this.vm.$isDestroyed) {
      this.$destroy()
    } else {
      _private.get(this).update.call(this, data)
    }
  }

  bind(vNode: VNode) {
    if (this.isDestroyed) return

    _private.get(this).bind.call(this, vNode, this.vm)

    this.isBound = true
  }

  unbind() {
    if (this.isDestroyed) return false

    if (this.attachedData) this.attachedData.delete(this.node)

    _private.get(this).observables = []
    _private.get(this).attr = null
    _private.get(this).vNode = null
    _private.get(this).orgNode = null
    _private.get(this).vm = null
    _private.get(this).cases = null
    _private.get(this).isDestroyed = true
    _private.get(this).isBound = false
    _private.get(this).metaData = {}

    this.emit('unbind')

    Directive.__count__--

    return false
  }

  addObservable(observable: Observable) {
    if (this.isDestroyed) return false

    this.on('unbind', observable.unsubscribe, observable)

    const { observables } = _private.get(this)

    if (observables.includes(observable)) return false

    observables.push(observable)

    return true
  }

  $destroy = () => {
    this.unbind()
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

  get vNode() {
    return _private.get(this).vNode
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

  get node() {
    return this.vNode?.node
  }

  get metaData() {
    return _private.get(this).metaData
  }

  set isBound(bool) {
    _private.get(this).isBound = bool
  }

  set reg(reg) {
    _private.get(this).reg = reg
  }

  set name(name) {
    _private.get(this).name = name
  }

  set observables(observables) {
    _private.get(this).observables = observables
  }

  set expression(expression) {
    _private.get(this).expression = expression
  }

  set vm(vm) {
    _private.get(this).vm = vm
  }

  set vNode(newElement) {
    if (this.isDestroyed) return

    const { vNode } = this

    if (vNode) vNode.off('detached', this.$destroy)

    newElement.on('detached', this.$destroy, this)

    _private.get(this).vNode = newElement
  }

  set orgNode(orgNode) {
    _private.get(this).orgNode = orgNode
  }

  set placeholder(placeholder) {
    _private.get(this).placeholder = placeholder
  }

  set key(key) {
    _private.get(this).key = key
  }

  set identifier(identifier) {
    _private.get(this).identifier = identifier
  }

  set attributeName(attributeName) {
    _private.get(this).attributeName = attributeName
  }

  set cases(cases) {
    _private.get(this).cases = cases
  }
}

export default Directive
