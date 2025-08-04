import mapToKeys from '../map-to-keys'
import setValidStateInput from '../set-valid-state-input'
import { addListener } from '../../utils'
import getValue from '../get-value'
import { DirectiveConfig } from '../../types'
import { ExpressionParser } from '../../parser/types/parser.types'

const getData = (data: any, placeholder: string) => getValue(data, mapToKeys(placeholder))

const parseInputValue = (value: any, type: 'number' | 'string') => {
  switch (type) {
    case 'number':
      return parseFloat(value)
    default:
      return value
  }
}

const getFormControl = (name: string, form: any) =>
  form
    ? form.data.constructor.name === 'Form'
      ? form.formControls[name]
      : form[name]
    : null

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'model',
  reg: /^(a-|\*)?model(\.[a-z]+)*/,
  bind(vNode, vm) {
    const { node } = vNode
    const { expression } = this
    const { modifiers } = this.attr
    const valueType = modifiers.includes('number') ? 'number' : 'string'

    this.vNode = vNode

    node.removeAttribute(this.attr.name)

    // @ts-expect-error
    let formElement = node.form || node.closest('form')
    let form = (formElement || {}).$form

    const changeListener = (e: Event | CustomEvent<HTMLElement>) => {
      // @ts-expect-error
      const { target, detail } = e
      const { data, key } = getData(vm, expression)
      const output = parseInputValue(
        // @ts-expect-error
        target?.value || detail || target?.$vm?.value || '',
        valueType
      )

      // @ts-expect-error
      formElement = formElement || node.form || node.closest('form')
      form = form || (formElement || {}).$form

      // @ts-expect-error
      const formControl = getFormControl(node.name, form)

      if (formControl) {
        formControl.value = output

        const isValid = formControl.validate()

        // @ts-expect-error
        setValidStateInput(isValid, formElement ? formElement[target?.name] : target)

        if (!isValid) return
      }

      data[key] = output
    }

    // @ts-expect-error
    const type = node.type || node.$name || vm.type || node.nodeName.toLowerCase()

    /*
      All these listeners have to be removed when element is no longer in the DOM.
    */
    if (/select/.test(type)) {
      addListener(node, 'change', changeListener)
    } else if (/radio|checkbox/.test(type)) {
      addListener(node, 'change', changeListener)
    } else {
      addListener(node, modifiers.includes('lazy') ? 'change' : 'input', changeListener)
    }

    this.update()
  },
  update() {
    const { expression, vNode, vm } = this
    const { node } = vNode
    const value = expressionParser(vm, expression, this)
    const type = node.type || node.$name || vm.type || node.nodeName.toLowerCase()

    let propertyName

    if (/select/.test(type)) {
      if (node.options) {
        for (const option of node.options) {
          option.selected = option.value === value
        }
      } else {
        propertyName = 'value'
      }
    } else if (/radio|checkbox/.test(type)) {
      if ('checked' in node) node.checked = node.value === value
      else propertyName = 'checked'
    } else {
      if ('value' in node) node.value = value
      else propertyName = 'value'
    }

    if (propertyName) {
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

      if (propertyName === 'value') {
        // node[propertyName] = value
        // node.setAttribute('value', value)
      } else {
        const nodeValue = node.getAttribute('value')
        const isChecked = nodeValue === value

        node[propertyName] = isChecked

        if (isChecked) node.setAttribute('checked', true)
        else node.removeAttribute('checked')
      }
    }
  },
})
