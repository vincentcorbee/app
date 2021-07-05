const compose = (...fns) =>
  fns.reduce(
    (a, f) =>
      (...args) =>
        f(a(...args))
  )

export default compose
