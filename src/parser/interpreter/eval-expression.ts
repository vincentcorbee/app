import { Directive } from '../../modules'
import accumulateValues from './accmulate-values'
import { BinaryOperations } from './operators'
import setObservable from './set-observable'

const evalExpression = (
  tree: any[],
  env: Record<string, any> = {},
  directive: Directive | null = null,
  startValue: any[] = [],
  options: Record<string, any> = {}
): any[] =>
  tree.reduce(
    (acc, node) => {
      const { type } = node

      switch (type) {
        case 'LogicalExpression': {
          const { operator } = node

          let [left] = evalExpression([node.left], env, directive, acc, options)
          let [right] = evalExpression([node.right], env, directive, acc, options)

          const operation = BinaryOperations[operator]

          if (operation) {
            return accumulateValues(acc, operation(left, right))
          }

          throw Error(`Unkown operation: ${operator}`)
        }
        case 'ExpressionStatement': {
          return evalExpression([node.expression], env, directive, acc, options)
        }

        case 'ConditionalExpression': {
          const test = evalExpression([node.test], env, directive, acc, options)[0]

          const result = test
            ? evalExpression([node.consequent], env, directive, acc, options)[0]
            : evalExpression([node.alternate], env, directive, acc, options)[0]

          return accumulateValues(acc, result)
        }

        case 'Identifier': {
          const { name } = node

          if (options.raw) return accumulateValues(acc, name)

          let result

          if (env.this.$data && env.this.$data.hasOwnProperty(name)) {
            result = env.this.$data[name]
          } else {
            result = env.this.hasOwnProperty(name)
              ? env.this[name]?.$data ?? env.this[name]
              : undefined
          }

          setObservable(name, env, directive)

          return accumulateValues(acc, result)
        }

        case 'MemberExpression': {
          const { object, property } = node

          let source

          if (object.type === 'MemberExpression') {
            source = evalExpression([object], env, directive, acc, options)[0]
          } else {
            const { name } = object
            const parent = name === 'this' ? env : env.this.$data || env.this

            source =
              name === '$parent' ? env.this.$parent : parent ? parent[name] : undefined
          }

          const prop = property.type === 'Identifier' ? property.name : property.value

          const output = source ? source[prop] : undefined

          if (output === undefined) {
            throw TypeError(`Cannot read property ${prop} of ${source}.`)
          }

          const base = output && output.__observable__ ? output : source

          setObservable(prop, base, directive)

          if (typeof output === 'function') {
            return accumulateValues(acc, output.bind(base))
          }

          return accumulateValues(acc, output)
        }

        case 'BinaryExpression': {
          const { operator } = node

          let [left] = evalExpression([node.left], env, directive, acc, options)
          let [right] = evalExpression([node.right], env, directive, acc, options)

          const operation = BinaryOperations[operator]

          if (operation)
            return accumulateValues(
              acc,
              options.raw ? `${left} ${operator} ${right}` : operation(left, right)
            )

          throw Error(`Unkown operation: ${operator}`)
        }

        case 'CallExpression': {
          const { callee } = node

          const name = callee.name

          const [fn] = evalExpression([callee], env, directive, acc, options)
          const [args] = evalExpression([node.arguments], env, directive, acc, options)

          if (fn === undefined) throw new ReferenceError(`${name} is undefined.`)

          if (typeof fn !== 'function') throw new TypeError(`${name} is not a function.`)

          return accumulateValues(acc, fn(...args))
        }

        case 'FunctionExpression': {
          const params = evalExpression(node.params, env, directive, acc, {
            ...options,
            raw: true,
          })
          const body = evalExpression([node.body], env, directive, acc, {
            ...options,
            raw: true,
          })

          const fn = Function(...params, body.join(';').replace(/^{|}$/g, ''))

          return accumulateValues(acc, fn.bind(env))
        }

        case 'BlockStatement': {
          const result = evalExpression(node.body, env, directive, acc, options)

          return accumulateValues(acc, options.raw ? `{ ${result} }` : result)
        }

        case 'ReturnStatement': {
          const [result] = evalExpression([node.argument], env, directive, acc, options)

          return accumulateValues(
            acc,
            options.raw
              ? `return ${typeof result === 'string' ? `"${result}"` : result};`
              : result
          )
        }

        case 'ObjectExpression': {
          const value = node.properties.reduce((result: any, prop: any) => {
            let key: any

            if (prop.key.type === 'Identifier') key = prop.key.name

            if (prop.key.type === 'StringLiteral') key = prop.key.name

            if (prop.key.type === 'Literal') {
              key = evalExpression([prop.key], env, directive, acc, options)[0]
            }

            if (key) {
              result[key] = evalExpression([prop.value], env, directive, acc, options)[0]
            }

            return result
          }, {})

          return accumulateValues(acc, value)
        }

        case 'ArrayExpression': {
          const { elements } = node
          return [
            elements.map(
              (element: any) => evalExpression([element], env, directive, acc, options)[0]
            ),
          ]
        }

        case 'Literal': {
          return accumulateValues(
            acc,
            options.raw && typeof node.value === 'string' ? `"${node.value}"` : node.value
          )
        }

        case 'ThisExpression': {
          return accumulateValues(acc, options.raw ? 'this' : env.this)
        }
        default: {
          if (Array.isArray(node)) {
            return accumulateValues(
              acc,
              evalExpression(node, env, directive, acc, options)
            )
          } else {
            return accumulateValues(acc, undefined)
          }
        }
      }
    },
    [...startValue]
  )

export default evalExpression
