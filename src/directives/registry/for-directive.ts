import { App, VNode } from '../../modules'
import { DirectiveConfig } from '../../types'
import bindDirectives from '../bind-directives'

import parseForExpression from '../parse-for-expression'

/**
 * only works on arrays
 */

export default (): DirectiveConfig => ({
  name: 'for',
  reg: /^(?:(a-)|:|\*)for/,
  bind(vNode: VNode) {
    const { attr } = this
    const parentVNode = vNode.parent

    this.vNode = parentVNode

    vNode.node.removeAttribute(attr.name)

    this.orgNode = vNode.node.cloneNode(true)

    /**
     * Make sure orginal node is removed from the DOM
     */
    vNode.toBeRemoved = true

    const expression = parseForExpression(attr.value, this)

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
  update(data: any) {
    const self = this
    const { vNode, expression, vm } = this
    const { children } = vNode
    const { lhs } = expression
    const { raw } = expression.rhs.value

    if (data.type === 'push' || (data.type === 'set' && data.prop === raw)) {
      const orgNode = this.orgNode.cloneNode(true)

      if (data.type === 'set') while (children.length) vNode.removeLastChild()

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

        // Inherit observers when adding new elements
        const scope = new App({
          el: node,
          data: appData,
          parent: vm,
        })

        bindDirectives(scope.$el, scope)

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

          vNode.addChild(scope.$el, null, vNode.node)

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
      vNode.removeLastChild()
    } else if (data.type === 'shift' && children.length) {
      vNode.removeFirstChild()
    } else if (data.type === 'splice') {
      const [index, count] = data.value

      vNode.removeChild(index, count)
    }
  },
})
