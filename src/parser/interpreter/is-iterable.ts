export function isIterable(value: any) {
  return typeof value[Symbol.iterator] === 'function'
}
