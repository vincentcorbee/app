import { isType } from '../../utils'
import { attachObservable } from '../../helpers'
import { Directive } from '../../modules'

const setObservableForObject = (value: any, directive: Directive, propagate: boolean) => {
  Object.keys(value).forEach(key => setObservable(key, value, directive, propagate))
}

const setObservableForArray = (
  value: any[],
  directive: Directive,
  propagate: boolean
) => {
  value.forEach((entry, i) => {
    if (isType('array', entry)) {
      setObservable(i, entry, directive, propagate)
    } else if (isType('object', entry)) {
      setObservableForObject(entry, directive, propagate)
    }
  })
}

const setObservableForFunction = (
  prop: string,
  value: any,
  directive: Directive,
  propagate: boolean
) => {
  Object.keys(value[prop]).forEach(key => {
    if (key !== prop) setObservable(key, value[prop], directive, propagate)
  })
}

const setObservable = (
  prop: any,
  env: any,
  directive: Directive | null = null,
  propagate = false
) => {
  if (!directive || directive.isDestroyed || !env) return

  const parentValue = env.this
    ? env.this.$$data && prop in env.this.$$data
      ? env.this.$$data
      : env.this
    : env.data || env.$$data || env
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

        if (propagate) {
          if (isType('array', childValue)) {
            setObservableForArray(childValue, directive, propagate)
          } else if (isType('object', childValue)) {
            setObservableForObject(childValue, directive, propagate)
          } else if (isType('function', childValue)) {
            setObservableForFunction(prop, parentValue, directive, propagate)
          }
        }
      }
    }
  }
}

export default setObservable
