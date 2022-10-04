const getCaller = (path, env) => {
  let caller
  caller = path.length ? env.get(path.shift()) : env.this

  path.forEach((p, i) => {
    if (caller.hasOwnProperty(p) || i === 0) {
      caller = output[p]
    } else {
      throw TypeError(`Cannot read property ${p}`)
    }
  })

  return caller
}

export default getCaller
