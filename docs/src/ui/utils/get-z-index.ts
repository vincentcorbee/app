export const getZIndex = (
  options: {
    selector?: string
    ctx?: HTMLElement
    refElement?: HTMLElement | null
  } = {}
) => {
  const { selector = 'body *', ctx = document.documentElement, refElement } = options

  return [...(ctx.querySelectorAll(selector) as unknown as HTMLElement[])].reduce(
    (acc, element) => {
      const index =
        element !== refElement
          ? parseInt(window.getComputedStyle(element).zIndex, 10) || 0
          : 0

      return index >= acc ? index + 1 : acc
    },
    0
  )
}
