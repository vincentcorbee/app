const getZindex = (selector = 'body *', ctx = document.documentElement) =>
  [...ctx.querySelectorAll(selector)].reduce((acc, element) => {
    const index = parseInt(window.getComputedStyle(element).zIndex, 10) || 0

    return index >= acc ? index + 1 : acc
  }, 1)

export default getZindex
