import accumulateValues from './accmulateValues'
import getCaller from './getCaller'
import mapFieldList from './mapFieldlist'
import mapProps from './mapProps'
import getPath from './getPath'
import getOperation from './operations/getOperation'
import setObservable from './setObservable'
import { flattenList } from '@digitalbranch/early-parser/src/helpers'

const evalExp = (tree, env = {}, directive = null) =>
  tree.reduce((acc, node) => {
    const { type } = node

    switch (type) {
      case 'ExpressionStatement':
        return evalExp([node.expression], env, directive)
      case 'Identifier': {
        return accumulateValues(acc, node)
      }
      case 'MemberExpression':
        const { object, property } = node

        let source

        if (object.type === 'MemberExpression') {
          source = evalExp([object], env, directive)[0]
        } else {
          const { name } = object
          const parent = env.this.data || env.this

          source =
            name == '$parent'
              ? env.this.$parent
              : name == '$route'
              ? parent[name]
              : parent
              ? parent[name]
              : undefined
        }

        const { name: prop } = property

        const output =
          prop == '$parent'
            ? source.$parent
            : prop == '$route'
            ? source[prop]
            : source
            ? source[prop]
            : undefined

        if (output === undefined)
          throw TypeError(`Cannot read property ${prop} of ${source}.`)

        const base = output && output.__observable__ ? output : source

        setObservable(prop, base, directive)

        return accumulateValues(acc, output)
      case 'BinaryExpression': {
        const { operator } = node

        let left = evalExp([node.left], env, directive)[0]
        let right = evalExp([node.right], env, directive)[0]

        // if (left && left.type && left.type === 'identifier') {
        //   setObservable(left[0], env, directive)

        //   left = env.get(left[0])
        // }

        // if (right && right.type && right.type === 'identifier') {
        //   setObservable(right[0], env, directive)

        //   right = env.get(right[0])
        // }

        const operation = getOperation(operator, 'binary')

        if (operation) return accumulateValues(acc, operation(left, right))

        throw Error(`Unkown operation: ${operator}`)
      }
      case 'StringLiteral': {
        return accumulateValues(acc, node.name)
      }
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

        return accumulateValues(
          acc,
          args.reduce((acc, arg) => {
            if (arg[0].type === 'identifier') setObservable(arg[0][0], env, directive)

            if (arg[1].type === 'identifier') setObservable(arg[1][0], env, directive)

            const key = arg[0].type === 'Identifier' ? arg[0][0] : arg[0]
            const val = arg[1].type === 'Identifier' ? env.get(arg[1][0]) : arg[1]

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
        const parent = env.this.data || env.this

        let output =
          prop == '$parent'
            ? env.this.$parent
            : prop == '$route'
            ? parent[prop]
            : parent
            ? parent[prop]
            : undefined

        path.forEach((p, i) => {
          if (output || i == 0) {
            let base = output

            output = output[p]

            base =
              output && output.__observable__ ? output : base.__observable__ ? base : null

            setObservable(p, base, directive)
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

export default evalExp
