import animate from '../animate/animate'
import removeStyles from '../remove-styles/remove-styles'
import isType from '../is-type/is-type'

const getDisplay = display => {
  display = configured || computed

  return display === 'inline' || display === 'none' || !display ? 'block' : display
}

const getHeight = (height, maxHeight) =>
  maxHeight !== 'none' && height > maxHeight ? maxHeight : height

const getRectHeight = (range, height) => {
  range.selectNode(node)

  const rects = range.getBoundingClientRect()

  return height > 0 && height < rects.height ? height : rects.height
}

export const showHide = (node, obj, callback) => {
  const range = document.createRange()
  const computed = getComputedStyle(node)
  const marginTop = parseInt(computed.marginTop.replace('px', ''), 10)
  const marginBottom = parseInt(computed.marginBottom.replace('px', ''), 10)
  const paddingTop = parseInt(computed.paddingTop.replace('px', ''), 10)
  const paddingBottom = parseInt(computed.paddingBottom.replace('px', ''), 10)
  const maxHeight = parseInt(computed.maxHeight.replace('px', ''), 10) || 'none'
  const styles = (node.getAttribute('style') || '').split(';').filter(prop => prop)
  const action = obj.action
  const style = obj.style || 'slide'
  const speed = obj.speed || 0.2
  const height = getHeight(
    node.offsetHeight || parseInt(computed.height.replace('px', ''), 10) || 0,
    maxHeight
  )
  const display = getDisplay(obj.display || computed.display)

  node.style.overflow = 'hidden'
  node.style.display = display
  node.style.visibility = 'visible'

  if (action === 'show') {
    let rectHeight

    if (style.includes('slide')) {
      rectHeight = getRectHeight(range, height)
    }

    animate({
      fn: rate => {
        if (style.includes('slide')) {
          node.style.height = rectHeight * rate + 'px'
          node.style.marginBottom = marginBottom * rate + 'px'
          node.style.paddingBottom = paddingBottom * rate + 'px'
        }

        if (style.includes('fade')) {
          node.style.opacity = rate
        }

        if (rate === 1) {
          removeStyles(node, styles)

          node.setAttribute('aria-hidden', false)
          node.style.display = null

          if (callback && isType('function', callback)) {
            callback(node)
          }
        }
      },
      dur: speed,
    })
  }

  if (action === 'hide') {
    animate({
      fn: rate => {
        if (style.includes('slide')) {
          node.style.height = height - height * rate + 'px'
          node.style.minHeight = height - height * rate + 'px'
          node.style.marginTop = marginTop - marginTop * rate + 'px'
          node.style.marginBottom = marginBottom - marginBottom * rate + 'px'
          node.style.paddingTop = paddingTop - paddingTop * rate + 'px'
          node.style.paddingBottom = paddingBottom - paddingBottom * rate + 'px'
        }

        if (style.includes('fade')) {
          node.style.opacity = 1 - rate
        }

        if (rate === 1) {
          removeStyles(node, styles)

          node.setAttribute('aria-hidden', true)

          if (callback && isType('function', callback)) {
            callback(node)
          }
        }
      },
      dur: speed,
    })
  }
}

export default showHide
