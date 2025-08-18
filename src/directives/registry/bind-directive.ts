import { camelToHyphen, hyphenToCamel } from '../../helpers'
import { ExpressionParser } from '../../parser/types/parser.types'
import { DirectiveConfig } from '../../types'

const BooleanAttributes = new Set([
  'checked',
  'disabled',
  'readonly',
  'required',
  'selected',
])

const setClassList = (node: HTMLElement, record: Record<string, boolean>) => {
  Object.entries(record).forEach(([key, value]) => {
    if (value) {
      node.classList.add(key)
    } else {
      node.classList.remove(key)
    }
  })
}

export default (expressionParser: ExpressionParser): DirectiveConfig<HTMLElement> => ({
  name: 'bind',
  reg: /^((a-|\*)bind)?:([^ ]+)/,
  bind(vNode) {
    const {
      attr: { name },
    } = this
    const { node } = vNode
    const attributeName = name.replace(/^((a-|\*)?bind)?:/, '')
    const staticClass = node.getAttribute('class')

    this.metaData.staticClass = staticClass
    this.attributeName = attributeName
    this.vNode = vNode
    this.vNode.node.removeAttribute(name)

    this.update()
  },
  update() {
    const {
      attributeName: name,
      vm,
      expression,
      vNode: { node },
      metaData: { staticClass },
    } = this
    const self = this
    const value = expressionParser(vm, expression, this)

    if (name === 'checked') {
      node.checked = value
    } else if (name === 'style') {
      let style = ''

      if (typeof value === 'string') {
        style = value
      } else {
        for (const prop in value) style += `${camelToHyphen(prop)}:${value[prop]};`
      }

      node.setAttribute(name, style)
    } else if (name === 'class') {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (typeof v === 'object') {
            setClassList(node, v)
          } else {
            node.classList.add(v)
          }
        })
      } else if (typeof value === 'object') {
        setClassList(node, value)
      } else {
        node.setAttribute(
          name,
          `${staticClass ? `${staticClass} ` : ''}${value ? value : ''}`
        )
      }
    } else {
      const propertyName = hyphenToCamel(name)
      /* Attach the data to the node */
      if (!(propertyName in node) && !node.hasOwnProperty(propertyName)) {
        Reflect.defineProperty(node, propertyName, {
          get() {
            return self.attachedData.get(node)
          },
          set(data) {
            self.attachedData.set(node, data)
          },
        })
      }

      node[propertyName] = value

      if (value === null || value === undefined) {
        node.removeAttribute(name)
      } else {
        node.setAttribute(name, value)
      }
    }
  },
})
