import App from '../models/App'
import { addListener } from '../lib/U'
import getPlaceholders from '../helpers/getPlaceholders'
import camelToHyphen from '../helpers/camelToHyphen'
import expressionParser from '../helpers/expressionParser'
import insertCase from './insertCase'
import addEventListener from './addListener'
import mapToKeys from './mapToKeys'
import parseForExpression from './parseForExpression'
import getValue from './getValue'
import hasKey from './hasKey'
import getListener from './getListener'
import getCases from './getCases'

// This is realy bad
// Create a new vm for each directive.
// Not doing that at the moment, only the for loop
/* 
  vm
  element
  identifier
  key
  attributeName?,
  placeholder?
  orgNode?
  identifier?
  key?
  case?
*/

const getDirective = attr => {
  const directives = [
    {
      name: 'html',
      reg: /^(a-)?html/,
      observables: [],
      bind(element, vm) {
        const self = this
        let node = element.node
        const identifier = attr.value
        const value = getValue(vm.data, {
          placeholder: identifier,
          identifiers: mapToKeys(identifier).keys
        })
        self.vm = vm
        self.element = element
        self.orgNode = node.cloneNode(true)
        self.identifier = identifier
        node.removeAttribute(attr.name)
        if (value.value !== undefined) {
          value.data.__observable__.subscribe(self, value.key)
          self.update({
            value: value.value
          })
        }
        node = null
      },
      update() {
        const self = this
        if (self.element.node) {
          const element = self.element
          const vm = self.vm
          const placeholder = self.identifier
          const value = getValue(vm.data, {
            placeholder,
            identifiers: mapToKeys(placeholder).keys
          })
          if (value.value !== undefined) {
            element.node.innerHTML = value.value
          }
        }
      }
    },
    {
      name: 'text',
      reg: /(\{{+.*\}})|^(a-)?text/, // /(\{{+[A-z\s.]+\}})|^(a-)?text/,
      observables: [],
      bind(element, vm) {
        const placeholder = attr.placeholder
        const self = this
        const expression = placeholder.value.replace(/^{{|}}$/g, '').trim()
        self.expression = expression
        self.vm = vm
        self.element = element
        self.orgNode = self.element.node.cloneNode(true)
        self.placeholder = placeholder
        self.key = expression
        self.update({
          prop: self.key
        })
      },
      update() {
        const self = this
        const element = self.element
        let node = element.node
        let parent = node.parentNode
        // Le shit
        if (node && parent) {
          const vm = self.vm
          const orgNode = self.orgNode
          let clone = orgNode.cloneNode(true)
          let placeholders = getPlaceholders(orgNode)
          let nodeValue = clone.data
          placeholders.forEach(placeholder => {
            let expression = placeholder.value.replace(/^{{|}}$/g, '').trim()
            let value = expressionParser(vm, expression, self)
            nodeValue = nodeValue.split(placeholder.value).join(value)
          })
          if (placeholders.length) {
            clone.data = nodeValue
            element.node = clone
            parent.replaceChild(clone, node)
          }
          clone = null
        }
        node = null
        parent = null
      }
    },
    {
      name: 'on',
      reg: /^(a-)?on:([^ ]+)/,
      observables: [],
      bind(element, vm) {
        const self = this
        const event = attr.name.replace(/^(a-)?on:/, '')
        let params = attr.value.match(/\([^)]+\)$/)
        let fnName = attr.value
        let isString = false
        self.element = element
        self.vm = vm
        element.node.removeAttribute(attr.name)
        if (params) {
          fnName = attr.value.replace(params[0], '')
          params = params[0].replace(/^\(/, '').replace(/\)$/, '')
        }
        if (/^"|'/.test(params)) {
          isString = true
          params = params.replace(/'|"/g, '')
        }
        const orgListener = getListener(fnName, vm)
        if (typeof orgListener === 'function') {
          if (params && !isString) {
            params = expressionParser(vm, params, self)
          }
          addEventListener(element.node, event, fnName, orgListener, element, params, vm)
        }
      },
      update() {}
    },
    {
      name: 'model',
      reg: /^(a-)?model/,
      observables: [],
      bind(element, vm) {
        const self = this
        let node = element.node
        const placeholder = attr.value
        const value = getValue(vm.data, {
          placeholder,
          identifiers: mapToKeys(placeholder).keys
        })
        self.element = element
        self.vm = vm
        self.placeholder = placeholder
        // if undefined, key does not exist
        if (value.value !== undefined) {
          if (node.nodeName === 'SELECT') {
            addListener(node, 'change', e => (value.data[value.key] = e.target.value))
            for (const option of node.options) {
              option.selected = option.value === value.value
            }
          } else if (/text|number|tel|email/.test(node.type)) {
            addListener(node, 'input', e => {
              value.data[value.key] = e.target.value
            })
            node.value = value.value
          } else if (/radio|checkbox/.test(node.type)) {
            addListener(node, 'change', e => (value.data[value.key] = e.target.value))
            node.checked = node.value === value.value
          }
          value.data.__observable__.subscribe(self, value.key)
        }
        node.removeAttribute(attr.name)
        node = null
      },
      update(data) {
        const self = this
        const placeholder = self.placeholder
        if (placeholder.indexOf(data.prop) > -1) {
          let node = self.element.node
          if (node.type === 'radio') {
            node.checked = node.value === data.value
          }
          node = null
        }
      }
    },
    {
      name: 'bind',
      reg: /^(a-)?bind:([^ ]+)/,
      observables: [],
      bind(element, vm) {
        const self = this
        const name = attr.name.replace(/^(a-)?bind:/, '')
        const expression = attr.value
        self.expression = expression
        self.attributeName = name
        self.vm = vm
        self.element = element
        self.element.node.removeAttribute(attr.name)
        self.update({
          prop: expression
        })
      },
      update() {
        const self = this
        if (self.element.node.parentNode) {
          const name = self.attributeName
          const vm = self.vm
          const expression = self.expression
          let node = self.element.node
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
            // Stringifying wil break reference
            // So this wil attach the object to the node
            self.attachedData = new WeakMap()
            if (!node.hasOwnProperty(name)) {
              Reflect.defineProperty(node, name, {
                get() {
                  return self.attachedData.get(node)
                },
                set(data) {
                  self.attachedData.set(node, data)
                }
              })
            }
            node[name] = expressionParser(vm, expression, self)
            node.setAttribute(name, expression)
          }
        }
      }
    },
    {
      name: 'show',
      reg: /^(a-)?show/,
      observables: [],
      bind(element, vm) {
        const self = this
        const value = getValue(vm.data, {
          placeholder: attr.value,
          identifiers: mapToKeys(attr.value).keys
        })
        self.element = element
        self.vm = vm
        self.identifier = attr.value
        self.key = value.key
        value.data.__observable__.subscribe(self, value.key)
        self.element.node.removeAttribute(attr.name)
        self.update({
          type: 'set',
          value: value.value,
          prop: value.key,
          target: value.data
        })
      },
      update(data) {
        const self = this
        if (hasKey(data, self.key)) {
          self.element.node.setAttribute('aria-hidden', !data.value)
        }
      }
    },
    {
      name: 'if',
      reg: /^(a-)?if/,
      observables: [],
      bind(element, vm) {
        const self = this
        let node = element.node
        const value = expressionParser(vm, attr.value, self)
        // get the index of the node
        const index = node.parentNode
          ? Array.prototype.indexOf.call(node.parentNode.children, element.node)
          : 0
        // Remove the attribute for clone
        node.removeAttribute(attr.name)
        self.cases = {
          if: {
            index,
            element: null,
            orgNode: element.node.cloneNode(true),
            identifier: attr.value
          }
        }
        self.cases = getCases(
          {
            index,
            element: null,
            orgNode: element.node.cloneNode(true),
            identifier: attr.value
          },
          node
        )
        self.vm = vm
        self.element = element.parent
        if (self.element) {
          self.element.removeChild(element)
        }
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
        self.update({
          type: 'set',
          value: value.value !== undefined ? value.value : value
        })
        node = null
      },
      update(data) {
        const self = this
        // Checking for the contstructor name is a hack that is
        // needed for the passing of the observer to the child properties
        if (!data.target || data.target.constructor.name !== 'Mask') {
          if (data.value) {
            if (!self.cases.if.element) {
              insertCase(self, 'if')
            }
            if (self.cases.else.element) {
              self.element.removeChild(self.cases.else.element)
              self.cases.else.element = null
            }
          } else {
            if (self.cases.if.element) {
              self.element.removeChild(self.cases.if.element)
              self.cases.if.element = null
            }
            if (self.cases.else) {
              insertCase(self, 'else')
            }
          }
        }
      }
    },
    {
      name: 'for',
      reg: /^(?:(a-)|:)for/,
      observables: [],
      bind(element, vm) {
        // only works on arrays at the moment
        const self = this
        const parentElement = element.parent
        self.element = parentElement
        self.vm = vm
        self.children = []
        element.node.removeAttribute(attr.name)
        self.orgNode = element.node.cloneNode(true)
        // Hack to remove orginal node
        // Removing of this node does not work if other directives are attached
        element.toBeRemoved = true
        // Empty elements need to be removed
        parentElement.node.removeChild(element.node)
        const expr = parseForExpression(attr.value, self, getValue, mapToKeys)
        if (expr.lhs !== null && expr.op !== null && expr.rhs !== null) {
          const data = expr.rhs.value
          self.expr = expr
          if (data) {
            self.update({
              type: 'push',
              value: data.__observable__.value,
              target: data.__observable__.value
            })
          }
        }
      },
      update(data) {
        const self = this
        let element = self.element
        const children = self.children
        const expr = self.expr
        const lhs = expr.lhs
        const vm = self.vm
        if (data.type === 'push' || (data.type === 'set' && !data.prop)) {
          let orgNode = self.orgNode.cloneNode(true)
          if (data.type === 'set') {
            while (element.children.length) {
              element.removeLastChild()
              children.pop()
            }
          }
          for (const item of data.value) {
            let node = orgNode.cloneNode(true)
            let obj = {}
            for (const prop in lhs) {
              if (prop === 'alias' || prop === 'val') {
                obj[lhs[prop]] = item
              } else if (prop === 'index') {
                obj.index = data.target.indexOf(item)
              }
            }
            // Inherit observers when adding new elements
            element.node.appendChild(node)
            let scope = new App({
              el: node,
              data: obj,
              parent: vm
            })
            element.addChild(scope.el)
            children.push(scope.el)
            node = null
            scope = null
          }
          orgNode = null
        } else if (data.type === 'pop' && element.children.length) {
          element.removeLastChild()
          children.pop()
        } else if (data.type === 'shift' && element.children.length) {
          element.removeFirstChild()
          children.shift()
        } else if (data.type === 'splice') {
          Array.prototype.splice
            .apply(children, data.value)
            .forEach(child => element.removeChild(child))
        }
        element = null
      }
    }
  ]
  return directives.find(directive => directive.reg.test(attr.name))
}
export default getDirective
