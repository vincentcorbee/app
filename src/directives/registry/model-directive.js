import mapToKeys from '../mapToKeys'
import setValidStateInput from '../setValidStateInput'
import { addListener } from '@digitalbranch/u'
import getValue from '../getValue'

const getData = (data, placeholder) =>
  getValue(data, {
    placeholder,
    identifiers: mapToKeys(placeholder).keys,
  })

const parseInputValue = (value, type) => {
  switch (type) {
    case 'number':
      return parseFloat(value)
    default:
      return value
  }
}

const getFormControl = (vm, name, form) =>
  form
    ? form.data.constructor.name == 'Form'
      ? form.formControls[name]
      : form[name]
    : vm[name]

export default expressionParser => ({
  name: 'model',
  reg: /^(a-|\*)?model(\.[a-z]+)*/,
  bind(element, vm) {
    const { node } = element
    const { expression } = this
    const { modifiers } = this.attr
    const type = modifiers.includes('number') ? 'number' : 'string'
    const { base, identifier } = mapToKeys(expression)
    const value = expressionParser(vm, expression, this)

    let formElement = node.closest('form')
    let form = (formElement || {}).$form

    const changeListener = e => {
      const { target } = e
      const { data, key } = getData(vm, expression)
      const output = parseInputValue(target.value, type)

      formElement = formElement || node.closest('form')
      form = form || (formElement || {}).$form

      const formControl = getFormControl(vm, node.name, form)

      if (formControl) {
        formControl.value = output

        const isValid = formControl.validate()

        setValidStateInput(isValid, formElement ? formElement[target.name] : target)

        if (!isValid) return
      }

      data[key] = output
    }

    this.identifier = identifier

    this.element = element
    this.vm = vm

    /*
      If undefined, key does not exist.
      All these listeners have to be removed when element is no longer in the DOM.
    */

    if (value !== undefined) {
      const { type } = node

      if (node.nodeName === 'SELECT') {
        addListener(node, 'change', changeListener)

        for (const option of node.options) {
          option.selected = option.value === value
        }
      } else if (/text|number|tel|email|password/.test(type)) {
        addListener(node, modifiers.includes('lazy') ? 'change' : 'input', changeListener)

        node.value = value
      } else if (/radio|checkbox/.test(type)) {
        addListener(node, 'change', changeListener)

        node.checked = node.value === value
      }

      vm.data.data.__observable__.subscribe(this, base)
    }

    node.removeAttribute(this.attr.name)
  },
  update(data) {
    const { expression, identifier, element } = this
    const { prop } = data

    if (expression.includes(prop)) {
      const node = element.node
      const { type } = node
      const value =
        data.value && data.value.hasOwnProperty(identifier)
          ? data.value[identifier]
          : data.value

      if (/radio|checkbox/.test(type)) {
        node.checked = node.value === value
      } else {
        node.value = value
      }
    }
  },
})
