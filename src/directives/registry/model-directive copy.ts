//@ts-nocheck
import mapToKeys from '../map-to-keys'
import setValidStateInput from '../set-valid-state-input'
import { addListener } from '../../utils'
import getValue from '../get-value'

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

const getFormControl = (vm, name, form) => {
  return form
    ? form.data.constructor.name === 'Form'
      ? form.formControls[name]
      : form[name]
    : vm[name]
}

export default expressionParser => ({
  name: 'model',
  reg: /^(a-|\*)?model(\.[a-z]+)*/,
  bind(vNode, vm) {
    const { node } = vNode
    const { expression } = this
    const { modifiers } = this.attr
    const type = modifiers.includes('number') ? 'number' : 'string'
    // const { base, identifier } = mapToKeys(expression)
    const value = expressionParser(vm, expression, this)

    this.vNode = vNode

    node.removeAttribute(this.attr.name)

    let formElement = node.form || node.closest('form')
    let form = (formElement || {}).$form

    const changeListener = e => {
      const { target, detail } = e
      const { data, key } = getData(vm, expression)
      const output = parseInputValue(
        target.value || detail || target.$vm?.value || '',
        type
      )

      formElement = formElement || node.form || node.closest('form')
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

    // this.identifier = identifier

    // console.log(base)

    /*
      If undefined, key does not exist.
      All these listeners have to be removed when element is no longer in the DOM.
    */
    if (value !== undefined) {
      const type = node.type || node.$name || vm.type

      if (node.nodeName === 'SELECT') {
        addListener(node, 'change', changeListener)

        for (const option of node.options) {
          option.selected = option.value === value
        }
      } else if (/radio|checkbox/.test(type)) {
        addListener(node, 'change', changeListener)

        if ('checked' in node) node.checked = node.value === value
      } else {
        addListener(node, modifiers.includes('lazy') ? 'change' : 'input', changeListener)

        if ('value' in node) node.value = value
      }

      // if (vm.$data) vm.$data.data.__observable__.subscribe(this, base)
    }
  },
  update(data) {
    const { expression, identifier, vNode } = this
    const { prop } = data
    const self = this

    console.log(data)

    // if (expression.includes(prop)) {
    const { node } = vNode
    const type = node.type || node.$name || vm.type
    const value =
      data.value && data.value.hasOwnProperty(identifier)
        ? data.value[identifier]
        : data.value
    let propertyName = 'value'

    if (/radio|checkbox/.test(type)) {
      if ('checked' in node) node.checked = node.value === value
      propertyName = 'checked'
    } else {
      if ('value' in node) node.value = value
    }

    /* Attach the data to the node */
    // if (!(propertyName in node) && !node.hasOwnProperty(propertyName)) {
    //   Reflect.defineProperty(node, propertyName, {
    //     get() {
    //       return self.attachedData.get(node)
    //     },
    //     set(data) {
    //       self.attachedData.set(node, data)
    //     },
    //   })
    // }

    // if (propertyName === 'value') {
    //   node[propertyName] = value

    //   node.setAttribute('value', value)
    // } else {
    //   node[propertyName] = node.value === value

    //   if (value) node.setAttribute('checked', '')
    //   else node.removeAttribute('checked')
    // }

    // }
  },
})
