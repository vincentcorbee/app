//@ts-nocheck
import isType from './is-type'

export const isInShadow = node => {
  while (node) {
    if (isType('shadowRoot', node)) return true

    node = node.parentNode
  }

  return false
}

export default isInShadow
