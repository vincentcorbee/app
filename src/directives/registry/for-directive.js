import App from '../../modules/App'

import mapToKeys from '../mapToKeys'
import parseForExpression from '../parseForExpression'
import getValue from '../getValue'

/**
 * only works on arrays
 */

export default () => ({
  name: 'for',
  reg: /^(?:(a-)|:|\*)for/,
  bind(element) {
    const parentElement = element.parent

    this.element = parentElement

    element.node.removeAttribute(this.attr.name)

    this.orgNode = element.node.cloneNode(true)

    /**
     * Make sure orginal node is removed from the DOM
     */
    element.toBeRemoved = true

    const expression = parseForExpression(this.attr.value, this, getValue, mapToKeys)

    if (expression.lhs !== null && expression.op !== null && expression.rhs !== null) {
      const data = expression.rhs.value.result

      this.expression = expression

      if (data) {
        const value = data.data || data

        this.update({
          type: 'push',
          value,
          target: value,
        })
      }
    }
  },
  update(data) {
    const self = this
    const { element, expression, vm } = this
    const { children } = element
    const { lhs } = expression
    const { raw } = expression.rhs.value

    if (data.type === 'push' || (data.type === 'set' && data.prop === raw)) {
      const orgNode = this.orgNode.cloneNode(true)

      if (data.type === 'set') while (children.length) element.removeLastChild()

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
                ).indexOf((item && item.constructor.name === 'Mask' && item.data) || item)
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
})
