import isType from '../is-type/is-type'
import isInShadow from '../is-in-shadow/is-in-shadow'

const isInPage = node =>
  isType('node', node) && (document.body.contains(node) || isInShadow(node))

export default isInPage
