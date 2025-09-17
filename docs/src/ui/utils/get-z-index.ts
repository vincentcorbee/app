export const getZIndex = ({
  selector = 'body *',
  ctx = document.documentElement,
  refElement,
}: {
  selector?: string
  ctx?: HTMLElement
  refElement?: HTMLElement | null
} = {}) =>
  [...(ctx.querySelectorAll(selector) as unknown as HTMLElement[])].reduce(
    (acc, element) => {
      const index =
        element !== refElement
          ? parseInt(window.getComputedStyle(element).zIndex, 10) || 0
          : 0

      return index >= acc ? index + 1 : acc
    },
    0
  )
