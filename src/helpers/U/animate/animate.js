import isType from '../is-type/is-type'

export const animate = (...objs) => {
  if (!isType('function', window.requestAnimationFrame)) {
    window.requestAnimationFrame = cb => setTimeout(cb, 1000 / 60)
  }

  let end = 0
  let d
  let obj
  let rate = 0

  const step = () => {
    const current = Date.now()
    const remaining = end - current

    if (remaining < 60) {
      if (obj) {
        rate = 1

        obj.fn(rate)
      }

      obj = objs.shift()

      if (obj) {
        d = (obj.dur || 0.5) * 1000
        end = current + d

        obj.fn(0)
      } else {
        return
      }
    } else {
      rate = remaining / d
      rate = 1 - Math.pow(rate, 3)

      obj.fn(rate)
    }

    window.requestAnimationFrame(step)
  }

  step()
}

export default animate
