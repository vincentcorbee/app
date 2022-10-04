import App from '../models/App'
import { addListener } from '../helpers/U'
import camelToHyphen from '../helpers/camelToHyphen'
import expressionParser from '../parser/expressionParser'
import insertCase from './insertCase'
import addEventListener from './addListener'
import mapToKeys from './mapToKeys'
import parseForExpression from './parseForExpression'
import getValue from './getValue'
import hasKey from './hasKey'
import getCases from './getCases'
import createDirective from './createDirective'
import setValidStateInput from './setValidStateInput'

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

// Create a new vm for each directive.
// Not doing that at the moment, only the for loop

const directiveRegistry = {
  directives: [
    {
      name: 'ref',
      reg: /^(a-|\*)?ref/,
      bind(element, vm) {
        vm.$refs = {
          [this.attr.value]: element.node,
        }
      },
    },
    {
      name: 'html',
      reg: /^(a-|\*)?html/,
      bind(element, vm) {
        const self = this
        const node = element.node
        const identifier = this.attr.value
        const value = getValue(vm.data, {
          placeholder: identifier,
          identifiers: mapToKeys(identifier).keys,
        })

        self.element = element
        self.orgNode = node.cloneNode(true)
        self.identifier = identifier

        node.removeAttribute(this.attr.name)

        if (value.value !== undefined) {
          value.data.__observable__.subscribe(self, value.key)

          self.update({
            value: value.value,
          })
        }
      },
      update() {
        const self = this

        if (self.element.node) {
          const element = self.element
          const placeholder = self.identifier
          const value = getValue(self.vm.data, {
            placeholder,
            identifiers: mapToKeys(placeholder).keys,
          })

          if (value.value !== undefined) {
            element.node.innerHTML = value.value
          }
        }
      },
    },
    {
      name: 'text',
      reg: /(\{{+.*\}})|^(a-|\*)?text/,
      bind(element) {
        const placeholder = this.attr.placeholder

        this.element = element
        this.orgNode = element.node.cloneNode(true)
        this.placeholder = placeholder

        // log(`${element.node.data} NODE DATA BIND`, 'blue')
        // log(`${placeholder.value} PLACEHOLDER BIND`, 'indigo')

        // console.log('----------')

        this.update()
      },
      update() {
        const element = this.element
        // log(`${this.expression} VALUE UPDATE`, 'darkyellow')

        if (element) {
          const node = element.node
          const parent = node.parentNode

          if (node && parent) {
            const { placeholder, expression, vm, orgNode } = this
            const clone = orgNode.cloneNode(true)
            const value = expressionParser(vm, expression, this)
            const nodeValue = clone.data.split(placeholder.value).join(value)

            if (node.data == nodeValue) return

            // log(`${placeholder.value} PLACEHOLDER UPDATE`, 'brown')
            // log(`${node.data} NODE DATA UPDATE`, 'darkgreen')
            // log(`${orgNode.data} ORG NODE UPDATE`, 'darkred')
            // log(`${nodeValue} VALUE UPDATE`, 'darkyellow')

            // if (placeholder) {
            clone.data = nodeValue
            element.node = clone

            parent.replaceChild(clone, node)
            // }
          }
        }
      },
    },
    {
      name: 'on',
      reg: /^((a-|\*)?on:)|@([^ ]+)(\.[a-z]+)*/,
      bind(element, vm) {
        const self = this
        const {
          attr: { name, value, modifiers, rawName },
        } = self
        const event = name.replace(/^((a-|\*)?on:)|@/, '')
        let [params] = value.match(/\([^)]*\)$/) || ['']
        const fnName = value.replace(params, '')

        self.element = element
        element.node.removeAttribute(rawName)

        params = params
          .replace(/^\(|\)$/g, '')
          .split(',')
          .filter(param => param)
          .map(param => {
            let isString = false

            if (/^"|'/.test(param)) {
              isString = true
              param = param.replace(/'|"/g, '')
            }

            return {
              isString,
              value: param.trim(),
            }
          })

        // const orgListener = getListener(fnName, vm)

        addEventListener(
          element,
          event,
          fnName,
          // orgListener,
          params,
          vm,
          self,
          modifiers
        )
      },
    },
    {
      name: 'form',
      reg: /^(a-|\*)?form/,
      bind(element, vm) {
        const self = this
        const { node } = element

        Reflect.defineProperty(node, '$form', {
          get() {
            return self.attachedData.get(node)
          },
          set(data) {
            self.attachedData.set(node, data)
          },
        })

        node.$form = vm[this.attr.value]

        node.removeAttribute(this.attr.name)
      },
    },
    {
      name: 'model',
      reg: /^(a-|\*)?model(\.[a-z]+)*/,
      bind(element, vm) {
        const self = this
        const { node } = element
        const { expression } = this
        const { modifiers } = this.attr
        const type = modifiers.includes('number') ? 'number' : 'string'
        const { base, identifier } = mapToKeys(expression)
        const value = expressionParser(vm, expression, this)
        const getFormControl = (vm, name, form) =>
          form
            ? form.data.constructor.name == 'Form'
              ? form.formControls[name]
              : form[name]
            : vm[name]
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

          console.log(data)
        }

        this.identifier = identifier

        self.element = element
        self.vm = vm

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
          } else if (/text|number|tel|email/.test(type)) {
            addListener(
              node,
              modifiers.includes('lazy') ? 'change' : 'input',
              changeListener
            )

            node.value = value
          } else if (/radio|checkbox/.test(type)) {
            addListener(node, 'change', changeListener)

            node.checked = node.value === value
          }

          vm.data.data.__observable__.subscribe(self, base)
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
    },
    {
      name: 'bind',
      reg: /^((a-|\*)?bind)?:([^ ]+)/,
      bind(element) {
        const name = this.attr.name.replace(/^((a-|\*)?bind)?:/, '')

        this.attributeName = name
        this.element = element
        this.element.node.removeAttribute(this.attr.name)

        this.update()
      },
      update() {
        const self = this
        const name = self.attributeName
        const vm = self.vm
        const expression = self.expression
        const node = self.element.node

        if (name === 'checked') {
          node.checked = expressionParser(vm, expression, self)
        } else if (name === 'style') {
          let style = ''

          if (/^{[^}]+}$/.test(expression)) {
            const obj = expressionParser(vm, expression, self)

            for (const prop in obj) {
              style += `${camelToHyphen(prop)}:${obj[prop]};`
            }
          }

          node.setAttribute(name, style)
        } else {
          // Attach the data to the node
          if (!node.hasOwnProperty(name)) {
            Reflect.defineProperty(node, name, {
              get() {
                return self.attachedData.get(node)
              },
              set(data) {
                self.attachedData.set(node, data)
              },
            })
          }

          node[name] = expressionParser(vm, expression, self)

          node.setAttribute(name, node[name])
        }
      },
    },
    {
      name: 'show',
      reg: /^(a-|\*)?show/,
      bind(element, vm) {
        const self = this
        const value = getValue(vm.data, {
          placeholder: this.attr.value,
          identifiers: mapToKeys(this.attr.value).keys,
        })

        self.element = element
        self.identifier = this.attr.value
        self.key = value.key
        value.data.__observable__.subscribe(self, value.key)
        // self.element.node.removeAttribute(this.attr.name)

        self.update({
          type: 'set',
          value: value.value,
          prop: value.key,
          target: value.data,
        })
      },
      update(data) {
        const self = this

        if (hasKey(data, self.key)) {
          self.element.node.setAttribute('aria-hidden', !data.value)
        }
      },
    },
    {
      name: 'if',
      reg: /^(a-|\*)?if/,
      bind(element, vm) {
        const node = element.node
        const value = expressionParser(vm, this.attr.value, this)
        // get the index of the node
        const index = node.parentNode
          ? [].indexOf.call(node.parentNode.childNodes, element.node)
          : 0

        value && value.value !== undefined ? value.value : value

        // Remove the attribute
        node.removeAttribute(this.attr.name)

        this.cases = getCases(
          {
            index,
            element: null,
            orgNode: node.cloneNode(true),
            identifier: this.attr.value,
          },
          node
        )
        this.element = element

        this.update({
          type: 'set',
          value,
        })
      },
      update(data) {
        const { cases } = this

        /*
          Checking for the contstructor name is a hack that is
          needed for passing of the observer to the child properties
        */

        if ((!data.target || data.target.constructor.name !== 'Mask') && cases) {
          if (data.value) {
            if (!cases.if.element) {
              insertCase(this, 'if')
            }

            if (cases.else && cases.else.element) {
              cases.else.element = null
            }
          } else {
            if (cases.if.element) {
              cases.if.element = null
            }

            insertCase(this, 'else')
          }
        }
      },
    },
    {
      name: 'for',
      reg: /^(?:(a-)|:|\*)for/,
      bind(element) {
        // only works on arrays at the moment
        const self = this
        const parentElement = element.parent

        self.element = parentElement

        element.node.removeAttribute(this.attr.name)

        self.orgNode = element.node.cloneNode(true)
        // Make sure orginal node is removed from the DOM
        element.toBeRemoved = true

        const expression = parseForExpression(this.attr.value, self, getValue, mapToKeys)

        if (
          expression.lhs !== null &&
          expression.op !== null &&
          expression.rhs !== null
        ) {
          const data = expression.rhs.value.result

          self.expression = expression

          if (data) {
            const value = data.data || data
            // const value = data.__observable__ ? data.__observable__.value : data

            self.update({
              type: 'push',
              value,
              target: value,
            })
          }
        }
      },
      update(data) {
        const self = this
        const element = self.element
        const children = self.element.children
        const expression = self.expression
        const lhs = expression.lhs
        const vm = self.vm
        const { raw } = expression.rhs.value

        if (data.type === 'push' || (data.type === 'set' && data.prop === raw)) {
          // if (data.type === 'push' || (data.type === 'set' && !data.prop)) {
          // if (data.type === 'push' || (data.type === 'set' && Array.isArray(data.value))) {
          const orgNode = self.orgNode.cloneNode(true)

          if (data.type === 'set') {
            while (children.length) {
              element.removeLastChild()
            }
          }

          if (!data.value) return

          for (const item of data.value) {
            const node = orgNode.cloneNode(true)
            const appData = {}

            for (const prop in lhs) {
              if (prop === 'alias' || prop === 'val') {
                appData[lhs[prop]] = item
              } else if (prop === 'index') {
                Reflect.defineProperty(appData, 'index', {
                  enumerable: true,
                  get() {
                    const value = data.prop ? data.target[data.prop] : data.target

                    return (
                      value.constructor.name === 'ArrayMask' ? value.data : value
                    ).indexOf(
                      (item && item.constructor.name === 'Mask' && item.data) || item
                    )
                  },
                })
              }
            }

            // Should have access to parent scope

            // Inherit observers when adding new elements
            const scope = new App({
              el: node,
              data: appData,
              parent: vm,
            })

            scope.on('ready', () => {
              if (!node.hasOwnProperty('$scope')) {
                Reflect.defineProperty(node, '$scope', {
                  get() {
                    return self.attachedData.get(node)
                  },
                  set(scope) {
                    self.attachedData.set(node, scope)
                  },
                })
              }

              node.$scope = {
                $vm: scope,
              }

              element.addChild(scope.el)

              if (appData.index !== undefined) {
                const observer =
                  appData.__observable__ &&
                  appData.__observable__.__observers__.find(
                    observable => observable[1] === 'index'
                  )

                if (observer) {
                  const [dir, prop] = observer

                  expression.rhs.value.result.__observable__.subscribe(dir, prop)
                }
              }
            })
          }
        } else if (data.type === 'pop' && children.length) {
          element.removeLastChild()
        } else if (data.type === 'shift' && children.length) {
          element.removeFirstChild()
        } else if (data.type === 'splice') {
          const [index, count] = data.value

          element.removeChild(index, count)
        }
      },
    },
  ],
  create(attr, vm) {
    const config = this.directives.find(directive => directive.reg.test(attr.name))

    if (!config) return

    /*
      If attr.value or attr.placeholder.value has $parent, set vm to vm.$parent and remove
    */

    const { name } = attr

    attr.rawName = name

    // if (attr.value) {
    //   console.log(attr.value.split(/\.(?!\([^\(]*)/))
    // }

    // attr.caller = ((attr.value || '').match(/(?<=\.)[^.]+$/) || [attr.value])[0]

    attr.modifiers = [...name.matchAll(/\.[a-z]+/g)].map(([mod]) => {
      attr.name = attr.name.replace(mod, '')

      return mod.replace('.', '')
    })

    config.attr = attr

    return createDirective(config, vm)
  },
}

export default (attr, vm) => directiveRegistry.create(attr, vm)
