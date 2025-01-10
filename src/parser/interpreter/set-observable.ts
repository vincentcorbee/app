import { isType } from '../../utils'
import { attachObservable } from '../../helpers'
import { Directive } from '../../modules'

// const setObservableForObject = (value: any, directive: Directive) => {
//   Object.keys(value).forEach(key => setObservable(key, value, directive))
// }

// const setObservableForArray = (value: any[], directive: Directive) => {
//   value.forEach((entry, i) => {
//     if (isType('array', entry)) {
//       setObservable(i, entry, directive)
//     } else if (isType('object', entry)) {
//       setObservableForObject(entry, directive)
//     }
//   })
// }

// const setObservableForFunction = (prop: string, value: any, directive: Directive) => {
//   Object.keys(value[prop]).forEach(key => {
//     if (key !== prop) setObservable(key, value[prop], directive)
//   })
// }

const setObservable = (prop: any, env: any, directive?: Directive | null) => {
  if (!directive || directive.isDestroyed || !env) return

  const parentValue = env.this
    ? env.this._data && prop in env.this._data
      ? env.this._data
      : env.this
    : env.data || env._data || env
  const parentObservable = parentValue && parentValue.__observable__

  if (parentObservable) {
    const subscribed = parentObservable.subscribe(directive, prop)

    if (subscribed) directive.addObservable(parentObservable)

    const childValue = parentValue[prop]

    if (childValue) {
      if (
        isType('object', childValue) ||
        isType('array', childValue) ||
        isType('function', childValue)
      ) {
        const childObservable = attachObservable(childValue)

        parentObservable.__observers__.forEach(([d, p]: [d: any, p: any]) =>
          childObservable.subscribe(d, p)
        )

        // if (isType('array', childValue)) {
        //   setObservableForArray(childValue, directive)
        // } else if (isType('object', childValue)) {
        //   setObservableForObject(childValue, directive)
        // } else if (isType('function', childValue)) {
        //   setObservableForFunction(prop, parentValue, directive)
        // }
      }
    }
  }
}

export default setObservable
