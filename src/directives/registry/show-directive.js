import hasKey from '../hasKey'
import mapToKeys from '../mapToKeys'
import getValue from '../getValue'

export default () => ({
  name: 'show',
  reg: /^(a-|\*)?show/,
  bind(element, vm) {
    const value = getValue(vm.data, {
      placeholder: this.attr.value,
      identifiers: mapToKeys(this.attr.value).keys,
    })

    this.element = element
    this.identifier = this.attr.value
    this.key = value.key
    value.data.__observable__.subscribe(this, value.key)

    this.update({
      type: 'set',
      value: value.value,
      prop: value.key,
      target: value.data,
    })
  },
  update(data) {
    const self = this

    if (hasKey(data, self.key)) self.element.node.setAttribute('aria-hidden', !data.value)
  },
})
