import expressionParser from '../parser/expression-parser'
import { ComponentInstance } from '../types'
import createDirective from './create-directive'
import {
  htmlDirective,
  refDirective,
  textDirective,
  onDirective,
  formDirective,
  modelDirective,
  bindDirective,
  showDirective,
  ifDirective,
  forDirective,
  computedDirective,
} from './registry'

/**
 * Create a new vm for each directive.
 * Not doing that at the moment, only the for loop
 */

const directiveRegistry = {
  directives: [
    textDirective(expressionParser),
    refDirective(expressionParser),
    htmlDirective(expressionParser),
    onDirective(expressionParser),
    formDirective(expressionParser),
    modelDirective(expressionParser),
    bindDirective(expressionParser),
    showDirective(expressionParser),
    ifDirective(expressionParser),
    forDirective(expressionParser),
    computedDirective(expressionParser),
  ],
  create(attr: any, vm: ComponentInstance) {
    const config = this.directives.find(directive => directive.reg.test(attr.name))

    if (!config) return

    /*
      If attr.value or attr.placeholder.value has $parent, set vm to vm.$parent and remove
    */

    const { name } = attr

    attr.rawName = name

    attr.modifiers = [...name.matchAll(/\.[a-z]+/g)].map(([mod]) => {
      attr.name = attr.name.replace(mod, '')

      return mod.replace('.', '')
    })

    // @ts-expect-error
    return createDirective({ ...config, attr }, vm)
  },
}

export default (attr: any, vm: ComponentInstance) => directiveRegistry.create(attr, vm)
