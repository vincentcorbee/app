import Environment from './Environment'
import flattenList from './flattenList'
import attachObservable from '../helpers/attachObservable'
import { isType } from '../helpers/U'

const unaryOperations = {
  '+': a => +a,
  '-': a => -a,
}
const assignOperations = {
  '=': (a, b, env) => env.set(a, b),
  '+=': (a, b, env) => env.set(a, env.get(a) + b),
  '-=': (a, b, env) => env.set(a, env.get(a) - b),
  '*=': (a, b, env) => env.set(a, env.get(a) * b),
  '/=': (a, b, env) => env.set(a, env.get(a) / b),
  '%=': (a, b, env) => env.set(a, env.get(a) - b),
  '<<=': (a, b, env) => env.set(a, env.get(a) << b),
  '>>=': (a, b, env) => env.set(a, env.get(a) >> b),
  '&=': (a, b, env) => env.set(a, env.get(a) & b),
  '^=': (a, b, env) => env.set(a, env.get(a) ^ b),
  '|=': (a, b, env) => env.set(a, env.get(a) | b),
}
const binaryOperations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '===': (a, b) => a === b,
  '==': (a, b) => a == b,
  '!==': (a, b) => a !== b,
  '!=': (a, b) => a != b,
  '&&': (a, b) => a && b,
  '||': (a, b) => a || b,
  '|': (a, b) => a | b,
  '&': (a, b) => a & b,
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
}
const getOperation = (op, type) => {
  switch (type) {
    case 'binary':
      return binaryOperations[op]
    case 'assign':
      return assignOperations[op]
    case 'unary':
      return unaryOperations[op]
  }
}
const mapFieldList = (arr, chunk = 2) => {
  const list = []
  while (arr.length) {
    list.push(arr.splice(0, chunk))
  }
  return list
}
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
const mapProps = list => {
  const path = []

  const map = list => {
    list.forEach(node => {
      if (node[0].type === 'accessor') {
        mapProps(node[0])
        path.push(node[1][0])
      } else if (node.type === 'accessor') {
        mapProps(node)
      } else {
        path.push(node[0])
      }
    })
  }

  map(list)

  return path
}
const getPath = arr =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) && (!val.type || val.type === 'accessor')
        ? acc.concat(getPath(val))
        : acc.concat([val]),
    []
  )
const setObservable = (prop, data, directive) => {
  if (directive && !directive.isDestroyed) {
    const parentValue = data.this ? data.this._data || data.this : data.data || data
    const parentObservable = parentValue && parentValue.__observable__

    if (parentObservable) {
      const subscribed = parentObservable.subscribe(directive, prop)

      if (subscribed && !directive.observables.includes(parentObservable)) {
        directive.observables.push(parentObservable)
      }
      const childObservable = parentValue[prop] && parentValue[prop].__observable__
      const childValue = childObservable ? parentValue[prop].data : undefined

      if (childValue) {
        if (isType('array', childValue)) {
          const subscribed = childObservable.subscribe(directive, prop)

          if (subscribed && !directive.observables.includes(childObservable)) {
            directive.observables.push(childObservable)
          }

          childValue.forEach((entry, i) => {
            if (isType('array', entry)) {
              setObservable(i, entry, directive)
            } else if (typeof entry === 'object') {
              for (const prop of Object.keys(entry)) {
                setObservable(prop, entry, directive)
              }
            }
          })
        } else if (isType('object', childValue)) {
          for (const prop of Object.keys(childValue)) {
            setObservable(prop, childValue, directive)
          }
        } else if (isType('function', childValue)) {
          // Set observable on parent for the function
          for (const prop of Object.keys(parentValue)) {
            setObservable(prop, parentValue, directive)
          }
        }
      } else {
        const childValue = parentValue[prop]

        if (childValue) {
          if (
            isType('object', childValue) ||
            isType('array', childValue) ||
            isType('function', childValue)
          ) {
            attachObservable(childValue)

            for (const [d, p] of parentObservable.__observers__) {
              childValue.__observable__.subscribe(d, p)
            }

            if (isType('array', childValue)) {
              childValue.forEach((entry, i) => {
                if (isType('array', entry)) {
                  setObservable(i, entry, directive)
                } else if (isType('object', entry)) {
                  for (const prop of Object.keys(entry)) {
                    setObservable(prop, entry, directive)
                  }
                }
              })
            } else if (isType('object', childValue)) {
              for (const prop of Object.keys(childValue)) {
                setObservable(prop, childValue, directive)
              }
            } else if (isType('function', childValue)) {
              // Set observable on parent for the function
              for (const prop of Object.keys(parentValue)) {
                setObservable(prop, parentValue, directive)
              }
            }
          }
        }
      }
    }
  }
}

const accumulateValues = (acc, val) => {
  if (val !== null) {
    acc.push(val)
  }

  return acc
}

const evalExp = (tree, env = {}, directive = null) =>
  tree.reduce((acc, node) => {
    const type = node.type

    switch (type) {
      case 'tenary': {
        return accumulateValues(
          acc,
          evalExp(node[0], env)[0]
            ? evalExp(node[1], env, directive)[0]
            : evalExp(node[2], env, directive)[0]
        )
      }
      case 'arrayLiteral': {
        return accumulateValues(acc, evalExp(node[0], env))
      }
      case 'objectLiteral': {
        const args = node[0]
          ? mapFieldList(flattenList(evalExp(node[0], env, directive)))
          : []

        return accumlateValues(
          acc,
          args.reduce((acc, arg) => {
            if (arg[0].type === 'identifier') {
              setObservable(arg[0][0], env, directive)
            }

            if (arg[1].type === 'identifier') {
              setObservable(arg[1][0], env, directive)
            }

            const key = arg[0].type === 'identifier' ? arg[0][0] : arg[0]
            const val = arg[1].type === 'identifier' ? env.get(arg[1][0]) : arg[1]

            acc[key] = val

            return acc
          }, {})
        )
      }
      case 'undefined': {
        return accumulateValues(acc, undefined)
      }
      case 'boolean': {
        return accumulateValues(acc, node[0] === 'true')
      }
      case 'this': {
        return accumulateValues(acc, env.this)
      }
      case 'accessor': {
        const path = mapProps(getPath(node))
        const prop = path.shift()

        let output =
          prop === '$route'
            ? env.this[prop].data
            : env.this.data
            ? env.this.data[prop]
            : env.this[prop]
            ? env.this[prop].data
            : undefined

        if (output && output.__observable__) {
          setObservable(prop, output, directive)
        }

        path.forEach((p, i) => {
          if (output && (output.hasOwnProperty(p) || i === 0)) {
            let base = output

            output = output[p]

            base =
              output && output.__observable__ ? output : base.__observable__ ? base : null

            if (base) {
              setObservable(p, base, directive)
            }
          } else {
            throw TypeError(`Cannot read property ${p} of ${output}.`)
          }
        })

        return accumulateValues(acc, output)
      }
      case 'call': {
        const fnName = node[0][0]
        let path = []
        let fn

        if (fnName.type && fnName.type === 'functionExpression') {
          fn = evalExp(node[0], env, directive)[0]
        } else if (fnName.type === 'accessor') {
          path = mapProps(flattenList(fnName))

          path.pop()

          fn = evalExp([fnName], env, directive)[0]
        } else {
          fn = env.get(fnName[0])
        }

        const args = evalExp(flattenList(node[1][0], directive), env).map(arg =>
          arg !== undefined && arg.type === 'identifier' ? env.get(arg[0]) : arg
        )

        if (typeof fn === 'function') {
          let caller = getCaller(path, env)

          return accumulateValues(acc, fn.apply(caller, args))
        } else if (fn === undefined) {
          throw new ReferenceError(`${fnName[fnName.length - 1][0]} is undefined.`)
        } else {
          throw new TypeError(`${fnName[fnName.length - 1][0]} is not a function.`)
        }
      }
      case 'program': {
        return accumulateValues(acc, evalExp(node, env, directive))
      }
      case 'number': {
        return accumulateValues(acc, node[0])
      }
      case 'string': {
        return accumulateValues(acc, node[0])
      }
      case 'assign': {
        const op = node[1]
        const operation = getOperation(op, 'assign')
        const left = evalExp(node[0], env, directive)[0][0]
        const right = evalExp(node[2], env, directive)[0]

        return accumulateValues(acc, operation(left, right, env))
      }
      case 'binop': {
        const op = node[1]
        let left = evalExp([node[0]], env, directive)[0][0]
        let right = evalExp([node[2]], env, directive)[0][0]

        if (left && left.type && left.type === 'identifier') {
          setObservable(left[0], env, directive)
          left = env.get(left[0])
        }

        if (right && right.type && right.type === 'identifier') {
          setObservable(right[0], env, directive)

          right = env.get(right[0])
        }

        const operation = getOperation(op, 'binary')

        if (operation) {
          return accumulateValues(acc, operation(left, right))
        }

        throw Error(`Unkown operation: ${op}`)
      }
      case 'uop': {
        const operation = getOperation(node[0], 'unary')

        if (operation) {
          return accumulateValues(acc, operation(evalExp([node[1]], env, directive)[0]))
        }

        throw Error(`Unkown operation: ${op}`)
      }
      case 'identifier': {
        return accumulateValues(acc, node)
      }
      default:
        if (Array.isArray(node)) {
          return accumulateValues(acc, evalExp(node, env, directive))
        } else {
          return accumulateValues(acc, undefined)
        }
    }
  }, [])

class Interpreter {
  constructor(AST) {
    const self = this

    self.AST = AST[0]
  }

  interpret(env = new Environment(), directive = null) {
    const self = this
    let val = evalExp(self.AST, env, directive)[0].pop()

    if (val && val.type && val.type === 'identifier') {
      const [prop] = val

      setObservable(prop, env, directive)

      val = env.this.data ? env.this.data[prop] : env.this[prop].data || undefined
    }

    console.log(val)

    return val === undefined ? '' : val
  }
}
export default Interpreter
