for (const [prop, value] of Object.entries(_computed)) {
  const fn = value.toString()
  const expression = fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}')).trim()

  console.log(expression)

  Reflect.defineProperty(vm, prop, {
    enumerable: true,
    get() {
      return value.call(vm)
    }
  })
}