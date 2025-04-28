export const bind = (oldFn: Function, ...args: any) => {
  const newFn = oldFn.bind.apply(oldFn, args)

  newFn.origin = oldFn

  return newFn
}
