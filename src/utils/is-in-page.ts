//@ts-nocheck
import isType from './is-type'
import isInShadow from './is-in-shadow'

export const isInPage = node =>
  isType('node', node) && (document.body.contains(node) || isInShadow(node))

export default isInPage
