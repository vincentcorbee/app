import { isType } from '@digitalbranch/u'
import attachObservable from '../../helpers/attachObservable'

/*
  This is a complete mess
*/

const setObservableForObject = (value, directive, prop) => {
  for (const key of Object.keys(value)) {
    setObservable(key, value, directive)
  }
}

const setObservableForArray = (value, directive) => {
  value.forEach((entry, i) => {
    if (isType('array', entry)) {
      setObservable(i, entry, directive)
    } else if (isType('object', entry)) {
      setObservableForObject(entry, directive)
    }
  })
}

const setObservableForFunction = (prop, value, directive) => {
  for (const key of Object.keys(value).filter(key => key !== prop)) {
    setObservable(key, value, directive)
  }
}

const setObservable = (prop, data, directive) => {
  if (directive && !directive.isDestroyed && data) {
    const parentValue = data.this ? data.this._data || data.this : data.data || data
    const parentObservable = parentValue && parentValue.__observable__

    if (parentObservable) {
      const subscribed = parentObservable.subscribe(directive, prop)

      if (subscribed && !directive.observables.includes(parentObservable)) {
        directive.observables.push(parentObservable)
      }

      const childValue = parentValue[prop]

      if (childValue) {
        if (
          isType('object', childValue) ||
          isType('array', childValue) ||
          isType('function', childValue)
        ) {
          const childObservable = attachObservable(childValue)

          for (const [d, p] of parentObservable.__observers__) {
            childObservable.subscribe(d, p)
          }

          if (isType('array', childValue)) {
            setObservableForArray(childValue, directive)
          } else if (isType('object', childValue)) {
            setObservableForObject(childValue, directive, prop)
          } else if (isType('function', childValue)) {
            setObservableForFunction(prop, parentValue, directive)
          }
        }
      }
    }
  }
}

export default setObservable
