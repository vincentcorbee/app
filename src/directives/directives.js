import App from '../models/App'
import { addListener } from '../helpers/U'
import camelToHyphen from '../helpers/camelToHyphen'
import expressionParser from '../helpers/expressionParser'
import insertCase from './insertCase'
import addEventListener from './addListener'
import mapToKeys from './mapToKeys'
import parseForExpression from './parseForExpression'
import getValue from './getValue'
import hasKey from './hasKey'
import getCases from './getCases'
import createDirective from './createDirective'

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

        self.vm = vm
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
      bind(element, vm) {
        const placeholder = this.attr.placeholder

        this.vm = vm
        this.element = element
        this.orgNode = element.node.cloneNode(true)
        this.placeholder = placeholder

        this.update()
      },
      update() {
        const element = this.element

        if (element) {
          const node = element.node
          const parent = node.parentNode
          const placeholder = this.placeholder

          if (node && parent) {
            const vm = this.vm
            const orgNode = this.orgNode
            const clone = orgNode.cloneNode(true)
            const expression = placeholder.value.replace(/^{{|}}$/g, '').trim()
            const value = expressionParser(vm, expression, this)
            const nodeValue = clone.data
              .split(placeholder.value)
              .join(typeof value === 'object' ? JSON.stringify(value, null, 2) : value)

            if (placeholder) {
              clone.data = nodeValue
              element.node = clone

              parent.replaceChild(clone, node)
            }
          }
        }
      },
    },
    {
      name: 'on',
      reg: /^((a-|\*)?on:)|@([^ ]+)/,
      bind(element, vm) {
        const self = this
        const {
          attr: { name, value },
        } = self
        const event = name.replace(/^((a-|\*)?on:)|@/, '')
        let [params] = value.match(/\([^)]*\)$/) || ['']
        const fnName = value.replace(params, '')

        self.element = element
        self.vm = vm
        element.node.removeAttribute(name)

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
          self
        )
      },
    },
    {
      name: 'model',
      reg: /^(a-|\*)?model/,
      bind(element, vm) {
        const self = this
        const node = element.node
        const placeholder = this.attr.value
        const value = getValue(vm.data, {
          placeholder,
          identifiers: mapToKeys(placeholder).keys,
        })

        self.element = element
        self.vm = vm
        self.placeholder = placeholder

        /*
          If undefined, key does not exist.
          All these listeners have to be removed when element is no longer in the DOM.
        */

        if (value.value !== undefined) {
          if (node.nodeName === 'SELECT') {
            addListener(node, 'change', e => (value.data[value.key] = e.target.value))

            for (const option of node.options) {
              option.selected = option.value === value.value
            }
          } else if (/text|number|tel|email/.test(node.type)) {
            addListener(node, 'input', e => (value.data[value.key] = e.target.value))

            node.value = value.value
          } else if (/radio|checkbox/.test(node.type)) {
            addListener(node, 'change', e => (value.data[value.key] = e.target.value))

            node.checked = node.value === value.value
          }

          value.data.__observable__.subscribe(self, value.key)
        }

        node.removeAttribute(this.attr.name)
      },
      update(data) {
        const self = this
        const placeholder = self.placeholder

        if (placeholder.indexOf(data.prop) > -1) {
          const node = self.element.node

          if (node.type === 'radio') {
            node.checked = node.value === data.value
          }
        }
      },
    },
    {
      name: 'bind',
      reg: /^(a-|\*)?\[?bind\]?:([^ ]+)/,
      bind(element, vm) {
        const self = this
        const name = this.attr.name.replace(/^(a-|\*)?bind:/, '')
        const expression = this.attr.value

        self.expression = expression
        self.attributeName = name
        self.vm = vm
        self.element = element
        self.element.node.removeAttribute(this.attr.name)

        self.update()
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

          console.log(node[name], 'BIND', expression)

          node.setAttribute(name, expression)
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
        self.vm = vm
        self.identifier = this.attr.value
        self.key = value.key
        value.data.__observable__.subscribe(self, value.key)
        self.element.node.removeAttribute(this.attr.name)

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
        this.vm = vm
        this.element = element

        this.update({
          type: 'set',
          value: value && value.value !== undefined ? value.value : value,
        })
      },
      update(data) {
        const self = this
        const { cases } = self

        /*
          Checking for the contstructor name is a hack that is
          needed for passing of the observer to the child properties
        */

        if ((!data.target || data.target.constructor.name !== 'Mask') && cases) {
          if (data.value) {
            if (!cases.if.element) {
              insertCase(self, 'if')
            }

            if (cases.else && cases.else.element) {
              cases.else.element = null
            }
          } else {
            if (cases.if.element) {
              cases.if.element = null
            }

            insertCase(self, 'else')
          }
        }
      },
    },
    {
      name: 'for',
      reg: /^(?:(a-)|:|\*)for/,
      bind(element, vm) {
        // only works on arrays at the moment
        const self = this
        const parentElement = element.parent

        self.element = parentElement
        self.vm = vm

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
          const data = expression.rhs.value

          self.expression = expression

          if (data) {
            const value = data.__observable__ ? data.__observable__.value : data

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

        // if (data.type === 'push' || (data.type === 'set' && !data.prop)) {
        if (data.type === 'push' || (data.type === 'set' && Array.isArray(data.value))) {
          const orgNode = self.orgNode.cloneNode(true)

          if (data.type === 'set') {
            while (children.length) {
              element.removeLastChild()
            }
          }

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
                    return (data.prop ? data.target[data.prop] : data.target).indexOf(
                      item
                    )
                  },
                })
              }
            }

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

                  expression.rhs.value.__observable__.subscribe(dir, prop)
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
  create(attr) {
    const config = this.directives.find(directive => directive.reg.test(attr.name))

    if (!config) return

    config.attr = attr

    return createDirective(config)
  },
}

export default attr => {
  return directiveRegistry.create(attr)
  // return directives.find(directive => directive.reg.test(attr.name))
}
