import { BinaryOperations, UnaryOperations } from './operators'
import { EnvironmentRecord } from './environment-record'
import { CompletionRecord, Expression, Program, Scope, Statements } from '../types'
import { createFunction } from './create-function'
import { isIterable } from './is-iterable'
import { Directive } from '../../modules'
import setObservable from './set-observable'

export function interpret(
  node: Program | Statements | Expression,
  env: Scope = new EnvironmentRecord(),
  directive: Directive | null = null,
  options: Record<string, any> = {}
): CompletionRecord | undefined {
  switch (node.type) {
    case 'Identifier': {
      const { name } = node

      setObservable(name, env, directive)

      return {
        type: 'NORMAL',
        value: env instanceof EnvironmentRecord ? env.get(name) : (env as any)[name],
      }
    }
    case 'Literal': {
      return {
        type: 'NORMAL',
        value: node.value,
      }
    }
    case 'BreakStatement': {
      return {
        type: 'BREAK',
        target: node.label?.name,
      }
    }
    case 'Program': {
      let result

      for (const stmt of node.body) result = interpret(stmt, env, directive, options)

      return result
    }
    case 'BlockStatement': {
      let value: CompletionRecord | undefined

      for (const stmt of node.body) {
        value = interpret(stmt, env, directive, options)

        if (value && value.type === 'BREAK') return value
      }

      return {
        type: 'NORMAL',
        value: value?.value,
      }
    }
    case 'ReturnStatement':
      return {
        type: 'RETURN',
        value: node.argument
          ? interpret(node.argument, env, directive, options)?.value
          : undefined,
      }
    case 'ExpressionStatement':
      return {
        type: 'NORMAL',
        value: interpret(node.expression, env, directive, options)?.value,
      }
    case 'ForOfStatement': {
      const scope = new EnvironmentRecord(env as EnvironmentRecord)

      const { kind } = node.left

      const [
        {
          id: { name },
        },
      ] = node.left.declarations

      const right = interpret(node.right, env, directive, options)

      if (!right || !isIterable(right.value))
        throw TypeError(`TypeError: ${right?.value} is not iterable`)

      const { value } = right

      const iterator = value[Symbol.iterator]()

      let result

      do {
        const next = iterator.next()

        if (next.done) break

        scope[kind === 'const' ? 'createImmutableBinding' : 'createMutableBinding'](
          name,
          next.value
        )

        result = interpret(node.body, scope, directive, options)

        scope.deleteBinding(name)

        if (result?.type === 'BREAK') break

        if (result?.type === 'CONTINUE') continue
      } while (true)

      return {
        type: 'NORMAL',
        value: result?.value,
      }
    }
    case 'ForStatement': {
      const scope = new EnvironmentRecord(env as EnvironmentRecord)

      if (node.init) interpret(node.init, scope, directive, options)

      do {
        const result = interpret(node.body, scope, directive, options)

        if (result?.type === 'BREAK') break

        if (result?.type === 'CONTINUE') continue

        if (node.update) interpret(node.update, scope, directive, options)
      } while (node.test ? interpret(node.test, scope, directive, options)?.value : false)

      return {
        type: 'NORMAL',
      }
    }
    case 'WhileStatement': {
      const scope = new EnvironmentRecord(env as EnvironmentRecord)

      while (interpret(node.test, scope, directive, options)?.value) {
        const result = interpret(node.body, scope, directive, options)

        if (result?.type === 'BREAK') break

        if (result?.type === 'CONTINUE') continue
      }

      return {
        type: 'NORMAL',
      }
    }
    case 'IfStatement':
      return {
        type: 'NORMAL',
        value: interpret(node.test, env, directive, options)?.value
          ? interpret(node.consequent, env, directive, options)?.value
          : node.alternate
          ? interpret(node.alternate, env, directive, options)?.value
          : undefined,
      }
    case 'BinaryExpression': {
      const op = BinaryOperations[node.operator]

      if (!op) throw Error(`Binary operator "${node.operator}" not supported`)

      return {
        type: 'NORMAL',
        value: op(
          interpret(node.left, env, directive, options)?.value,
          interpret(node.right, env, directive, options)?.value,
          env
        ),
      }
    }
    case 'LogicalExpression': {
      const op = BinaryOperations[node.operator]

      if (!op) throw Error(`Logical operator "${node.operator}" not supported`)

      return {
        type: 'NORMAL',
        value: op(
          interpret(node.left, env, directive, options)?.value,
          interpret(node.right, env, directive, options)?.value,
          env
        ),
      }
    }
    case 'UpdateExpression': {
      switch (node.argument.type) {
        case 'Identifier':
          return {
            type: 'NORMAL',
            value: env.set(
              node.argument.name,
              UnaryOperations[node.operator](env.get(node.argument.name))
            ),
          }
        default:
          throw SyntaxError('SyntaxError: Invalid left-hand side in assignment')
      }
    }
    case 'UnaryExpression': {
      const op = UnaryOperations[node.operator]

      if (!op) throw Error(`Unary operator "${node.operator}" not supported`)

      return {
        type: 'NORMAL',
        value: op(interpret(node.argument, env, directive, options)?.value, env),
      }
    }
    case 'MemberExpression': {
      const { computed } = node

      let property = node.property

      if (computed) {
        property = {
          type: 'Identifier',
          name: interpret(node.property, env, directive, options)?.value,
        }
      }

      const value = interpret(
        property,
        interpret(node.object, env, directive, options)?.value,
        directive,
        options
      )?.value

      return {
        type: 'NORMAL',
        value,
      }
    }
    case 'ObjectExpression': {
      return {
        type: 'NORMAL',
        value: node.properties.reduce((acc: any, prop) => {
          let key: any

          if (prop.key.type === 'Identifier') key = prop.key.name

          if (prop.key.type === 'Literal')
            key = interpret(prop.key, env, directive, options)?.value

          if (key) acc[key] = interpret(prop.value, env, directive, options)?.value

          return acc
        }, {}),
      }
    }
    case 'ArrayExpression':
      return {
        type: 'NORMAL',
        value: node.elements.map(el => interpret(el, env, directive, options)?.value),
      }
    case 'CallExpression': {
      let name = ''

      if (node.callee.type === 'Identifier')
        name = interpret(node.callee, env, directive, options)?.value

      // @ts-expect-error
      if (node.callee.type === 'MemberExpression') name = node.callee.property.name

      const fn = interpret(node.callee, env, directive, options)?.value

      if (typeof fn !== 'function') {
        throw TypeError(`TypeError: ${name} is not a function`)
      }

      return {
        type: 'NORMAL',
        value: fn.apply(
          env,
          node.arguments.map(arg => interpret(arg, env, directive, options)?.value)
        ),
      }
    }
    case 'ConditionalExpression': {
      return {
        type: 'NORMAL',
        value: interpret(node.test, env, directive, options)?.value
          ? interpret(node.consequent, env, directive, options)?.value
          : interpret(node.alternate, env, directive, options)?.value,
      }
    }
    case 'AssignmentExpression': {
      switch (node.left.type) {
        case 'Identifier':
          return {
            type: 'NORMAL',
            value: env.set(
              node.left.name,
              interpret(node.right, env, directive, options)?.value
            ),
          }
        default:
          throw SyntaxError('SyntaxError: Invalid left-hand side in assignment')
      }
    }
    case 'FunctionExpression': {
      const func = createFunction(node, env)

      return {
        type: 'NORMAL',
        value: func,
      }
    }
    case 'ThisExpression': {
      return {
        type: 'NORMAL',
        value: env.get('this'),
      }
    }
    case 'FunctionDeclaration': {
      const func = createFunction(node, env)

      return {
        type: 'NORMAL',
        value: env.createImmutableBinding(node.id?.name, func),
      }
    }
    case 'VariableDeclaration': {
      const mutable = node.kind !== 'const'

      let value

      for (const decl of node.declarations) {
        value = interpret(decl, env, directive, options)?.value

        if (mutable) env.createMutableBinding(decl.id.name, value)
        else env.createImmutableBinding(decl.id.name, value)
      }

      return {
        type: 'NORMAL',
        value,
      }
    }
    case 'VariableDeclarator': {
      return {
        type: 'NORMAL',
        value: node.init
          ? interpret(node.init, env, directive, options)?.value
          : undefined,
      }
    }
    default:
      throw SyntaxError(`SyntaxError: Unexpected node type ${node.type}`)
  }
}
