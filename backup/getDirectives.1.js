import App from '../src/models/App'
import Element from '../src/models/Element'
import { U } from '../src/lib/U'
import getPlaceholders from '../src/helpers/getPlaceholders'
import camelToHyphen from '../src/helpers/camelToHyphen'
import expressionParser from '../src/helpers/expressionParser'
import parseObject from '../src/helpers/parseObject'
// Create a new vm for each directive. Not doing that at the moment, only the for loop
const getCases = (ifCase, node) => {
  const regElse = /^(a-)?else/
  const regElseIf = /^(a-)?else-if/
  const index = ifCase.index
  const cases = {
    else: null,
    elseif: []
  }
  cases.if = ifCase
  let nextElement = node.nextElementSibling
  while (nextElement && !cases.else) {
    for (const attr of nextElement.attributes) {
      if (regElseIf.test(attr.name)) {
        nextElement.removeAttribute(attr.name)
        cases.elseif.push({
          index,
          element: null,
          orgNode: nextElement.cloneNode(true),
          key: null,
          identifier: null
        })
        nextElement.parentNode.removeChild(nextElement)
        break
      } else if (regElse.test(attr.name)) {
        cases.else = {
          index,
          element: null,
          orgNode: nextElement.cloneNode(true),
          key: null,
          identifier: null
        }
        nextElement.parentNode.removeChild(nextElement)
        break
      }
    }
    nextElement = nextElement.nextElementSibling
  }
  return cases
}
const getListener = (name, vm) => {
  let listener = null
  if (!listener) {
    while (vm !== null && !listener) {
      listener = vm[name]
      vm = vm.parent
    }
  }
  return listener
}
const hasKey = (data, key) =>
  data.prop === key && Object.keys(data.target).indexOf(key) > -1
const getValue = (data, obj) => {
  let arr = obj.identifiers
  let placeholder = obj.placeholder
  let key = arr.shift() || null
  let value = key ? data[key] : undefined
  if (value && arr.length > 0) {
    obj.identifiers = arr
    return getValue(value, obj)
  } else {
    return {
      value,
      data,
      key,
      placeholder
    }
  }
}
const parseForExpression = (input, self, getValue, mapToKeys) => {
  const tokens = [
    ['IGNORE', /^[ \t\v\r]+/],
    ['OP', /^in|of/],
    {
      type: 'LHS',
      reg: /^\((?:[a-z, A-Z]+)\)|[a-zA-Z]+/,
      value: value => {
        if (value.indexOf('(') === 0) {
          return value
            .substring(1, value.length - 1)
            .split(',')
            .map(val => val.trim())
        }
        return [value]
      }
    },
    {
      type: 'RHS',
      reg: /^[a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*/,
      value: value => {
        let data = getValue(self.vm.data, {
          placeholder: value,
          identifiers: mapToKeys(value).keys
        })
        if (!data.value) {
          let parent = vm.parent
          while (!data.value && parent) {
            data = getValue(parent.data, {
              placeholder: self.source,
              identifiers: mapToKeys(self.source).keys
            })
            parent = parent.parent
          }
        }
        return data
      }
    }
  ]
  let index = 0
  const result = []
  let isLhs = false
  const readToken = () => {
    let curInput = input.substring(index)
    if (curInput.length === 0) {
      return null
    }
    for (let token of tokens) {
      if (Array.isArray(token)) {
        token = {
          type: token[0],
          reg: token[1]
        }
      }
      let curIndex = index
      let reg = token.reg
      let type = token.type
      let match = curInput.match(reg)
      if (reg && type && match) {
        let value = match[0]
        index += value.length
        if (type === 'LHS') {
          if (isLhs) {
            continue
          } else {
            isLhs = true
          }
        } else if (type === 'RHS' && isLhs) {
          isLhs = false
        }
        if (type === 'IGNORE') {
          return readToken()
        }
        if (typeof token.value === 'function') {
          value = token.value(value)
        }
        return {
          type,
          reg,
          value,
          start: curIndex,
          end: index
        }
      }
    }
  }
  let tok = null
  while ((tok = readToken()) !== null) {
    result.push(tok)
  }
  const obj = {
    lhs: null,
    op: null,
    rhs: null
  }
  let ident = (result.find(token => token.type === 'RHS') || {}).value
  if (ident && ident.value) {
    let lhs = result.find(token => token.type === 'LHS')
    if (lhs) {
      obj.rhs = ident
      obj.lhs = {}
      const type = ident.value.constructor.name === 'ArrayMask' ? 'array' : 'object'
      const args = lhs.value
      args.forEach((arg, i) => {
        if (type === 'array') {
          if (i === 0) {
            obj.lhs.alias = arg
          } else if (i === 1) {
            obj.lhs.index = arg
          }
        } else {
          if (i === 0) {
            obj.lhs.value = arg
          } else if (i === 1) {
            obj.lhs.key = arg
          } else if (i === 2) {
            obj.lhs.index = arg
          }
        }
      })
    }
    obj.op = (result.find(token => token.type === 'OP') || {}).value
  }
  return obj
}
const getIdentifiersFromObject = value => {
  let ident = /^[a-z\-0-9]+(?:\.[a-z\-0-9]+|\[[a-z\-0-9]+\])*/
  let identifiers = []
  value
    .replace(/^{|}$/g, '')
    .trim()
    .split(',')
    .forEach(line => {
      line = line.split(/\s*:\s*/)
      line[1].split(/\s+/).forEach(cur => {
        if (ident.test(cur)) {
          identifiers.push(cur)
        }
      })
    })
  return identifiers
}
const mapToKeys = placeholder => {
  const identifier = placeholder.replace(/[{{ *}}]/g, '')
  const keys = identifier
    .split('.')
    .map(entry => {
      let prop = entry.match(/\[[^\]*]\]/)
      prop = prop !== null ? prop[0] : null
      if (prop) {
        entry = entry.replace(prop, '')
        prop = prop.replace(/\[|\]/g, '')
        return [entry, prop]
      } else {
        return entry
      }
    })
    .reduce((acc, val) => acc.concat(val), [])
  return {
    keys,
    identifier
  }
}
const addListener = (node, event, fnName, orgListener, element, params, vm) => {
  // Bind listner to current vm instance?
  const listener = e => {
    if (fnName === 'emit') {
      vm.emit(params, e)
    } else {
      orgListener.call(vm, params || e)
    }
  }
  element.listeners[event] = listener
  if (HTMLElement.prototype.hasOwnProperty(`on${event}`)) {
    U.addListener(node, event, listener)
  } else {
    //Work around for parent child communication
    vm.children.forEach(child => child.on(event, listener))
  }
}
const insertCase = (directive, c) => {
  const parentElement = directive.parentElement
  const node = directive.cases[c].orgNode.cloneNode(true)
  const element = new Element(node, directive.vm, parentElement)
  parentElement.addChild(element)
  parentElement.node.insertBefore(
    node,
    parentElement.node.childNodes[directive.cases[c].index + 1]
  )
  directive.cases[c].element = element
}
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
      bind(element, vm) {
        const self = this
        const node = element.node
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
          value.data.__observable__.subscribe(self)
          self.update({
            value: value.value
          })
        }
      },
      update(data) {
        const self = this
        const element = self.element
        const vm = self.vm
        const node = element.node
        const placeholder = self.identifier
        if (node) {
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
      bind(element, vm) {
        // This can only handle one identifier per expression
        const placeholder = attr.placeholder
        const self = this
        const node = element.node
        const value = getValue(vm.data, {
          placeholder: placeholder.value,
          identifiers: mapToKeys(placeholder.value).keys
        })
        let expression = placeholder.value.replace(/^{{|}}$/g, '').trim()
        self.expression = expression
        self.vm = vm
        self.element = element
        self.orgNode = node.cloneNode(true)
        self.placeholder = placeholder
        if (value.value !== undefined) {
          self.key = value.key
          value.data.__observable__.subscribe(self)
          self.update({
            value: value.value,
            prop: self.key
          })
        }
      },
      update(data) {
        const self = this
        const element = self.element
        const vm = self.vm
        const orgNode = self.orgNode
        const node = element.node
        const parent = node.parentNode
        if (node && parent && self.placeholder.value.indexOf(data.prop) > -1) {
          let clone = orgNode.cloneNode(true)
          let placeholders = getPlaceholders(orgNode)
          let nodeValue = clone.data
          placeholders.forEach(placeholder => {
            const value = getValue(vm.data, {
              placeholder: placeholder.value,
              identifiers: mapToKeys(placeholder.value).keys
            })
            if (value.value !== undefined) {
              nodeValue = nodeValue.split(placeholder.value).join(value.value)
            }
          })
          if (placeholders.length) {
            clone.data = nodeValue
            element.node = clone
            parent.replaceChild(clone, node)
          }
        }
      }
    },
    {
      name: 'on',
      reg: /^(a-)?on:([^ ]+)/,
      bind(element, vm) {
        const self = this
        const node = element.node
        const event = attr.name.replace(/^(a-)?on:/, '')
        let params = attr.value.match(/\([^)]+\)$/)
        let fnName = attr.value
        let isString = false
        self.element = element
        self.vm = vm
        node.removeAttribute(attr.name)
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
            params = getValue(vm.data, {
              placeholder: params,
              identifiers: mapToKeys(params).keys
            }).value
          }
          addListener(node, event, fnName, orgListener, element, params, vm)
        }
      },
      update() {}
    },
    {
      name: 'model',
      reg: /^(a-)?model/,
      bind(element, vm) {
        const node = element.node
        const placeholder = attr.value
        const value = getValue(vm.data, {
          placeholder,
          identifiers: mapToKeys(placeholder).keys
        })
        self.vm = vm
        // if undefined, key does not exist
        if (value.value !== undefined) {
          U.addListener(node, 'input', e => (value.data[value.key] = e.target.value))
        }
        node.removeAttribute(attr.name)
      },
      update() {}
    },
    {
      name: 'bind',
      reg: /^(a-)?bind:([^ ]+)/,
      bind(element, vm) {
        const self = this
        const name = attr.name.replace(/^(a-)?bind:/, '')
        const node = element.node
        let placeholders = []
        // This only works for property accessors i.e. prop, prop.prop prop[prop]
        if (/^{[^}]+}$/.test(attr.value)) {
          placeholders = getIdentifiersFromObject(attr.value)
        } else {
          placeholders.push(attr.value)
        }
        self.attributeName = name
        self.vm = vm
        self.attributeValue = attr.value
        self.keys = []
        self.element = element
        placeholders.forEach(placeholder => {
          let value = getValue(vm.data, {
            placeholder,
            identifiers: mapToKeys(placeholder).keys
          })
          self.keys.push(value.key)
          value.data.__observable__.subscribe(self)
          node.removeAttribute(attr.name)
          self.update({
            type: 'set',
            value: value.value,
            prop: value.key,
            target: value.data
          })
        })
      },
      update(data) {
        const self = this
        const name = self.attributeName
        if (self.keys.some(key => hasKey(data, key))) {
          if (name === 'checked') {
            self.element.node.checked = data.value
          } else if (name === 'style') {
            let style = ''
            // This is horrible
            if (/^{[^}]+}$/.test(self.attributeValue)) {
              // const obj = parseObject(self.attributeValue)
              const obj = expressionParser(vm, self.attributeValue, self)
              for (const prop in obj) {
                style += `${camelToHyphen(prop)}:${obj[prop]};`
              }
            }
            self.element.node.setAttribute(name, style)
          } else {
            self.element.node.setAttribute(name, JSON.stringify(data.value))
          }
        }
      }
    },
    {
      name: 'show',
      reg: /^(a-)?show/,
      bind(element, vm) {
        const self = this
        const node = element.node
        const value = getValue(vm.data, {
          placeholder: attr.value,
          identifiers: mapToKeys(attr.value).keys
        })
        self.element = element
        self.vm = vm
        self.identifier = attr.value
        self.key = value.key
        value.data.__observable__.subscribe(self)
        node.removeAttribute(attr.name)
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
      bind(element, vm) {
        const self = this
        const node = element.node
        const value = getValue(vm.data, {
          placeholder: attr.value,
          identifiers: mapToKeys(attr.value).keys
        })
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
            key: value.key,
            identifier: attr.value
          }
        }
        self.cases = getCases(
          {
            index,
            element: null,
            orgNode: element.node.cloneNode(true),
            key: value.key,
            identifier: attr.value
          },
          node
        )
        self.vm = vm
        self.parentElement = element.parent
        if (self.parentElement) {
          self.parentElement.removeChild(element)
        }
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
        value.data.__observable__.subscribe(self)
        self.update({
          type: 'set',
          value: value.value,
          prop: value.key,
          target: value.data
        })
      },
      update(data) {
        const self = this
        const parentElement = self.parentElement
        if (hasKey(data, self.cases.if.key)) {
          if (data.value) {
            if (!self.cases.if.element) {
              insertCase(self, 'if')
            }
            if (self.cases.else.element) {
              parentElement.removeChild(self.cases.else.element)
              self.cases.else.element = null
            }
          } else {
            if (self.cases.if.element) {
              parentElement.removeChild(self.cases.if.element)
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
      reg: /^(a-)?for/,
      bind(element, vm) {
        // only works on arrays at the moment
        const self = this
        const parentElement = element.parent
        self.element = parentElement
        self.vm = vm
        element.node.removeAttribute(attr.name)
        self.orgNode = element.node.cloneNode(true)
        // Hack to remove orginal node
        // Removing of this node does not work if other directives are attached
        element.toBeRemoved = true
        // Empty elements need to be removed
        parentElement.node.removeChild(element.node)
        const expr = parseForExpression(attr.value, self, getValue, mapToKeys)
        if (expr.lhs !== null && expr.op !== null && expr.rhs !== null) {
          self.expr = expr
          const data = expr.rhs
          if (data.value) {
            data.value.__observable__.subscribe(self) /
              self.update({
                type: 'push',
                value: data.value.__observable__.value,
                target: data.value.__observable__.value
              })
          }
        }
      },
      update(data) {
        const self = this
        const element = self.element
        const expr = self.expr
        const lhs = expr.lhs
        const vm = self.vm
        const orgNode = self.orgNode.cloneNode(true)
        // How do I update indexes ????????
        if (data.type === 'push') {
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
            // Dit gaat niet goed
            element.node.appendChild(node)
            const scope = new App({
              el: node,
              data: obj,
              parent: vm
            })
            element.addChild(scope.el)
          }
        } else if (data.type === 'pop' && element.children.length) {
          element.removeLastChild()
        }
      }
    }
  ]
  return directives.find(directive => directive.reg.test(attr.name))
}
export default getDirective
