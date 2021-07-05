const bind = (oldFn, ...args) => {
  const newFn = oldFn.bind.apply(oldFn, args)

  newFn.origin = oldFn

  return newFn
}

export default bind
