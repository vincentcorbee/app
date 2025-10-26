import { BinaryOperations, UnaryOperations } from './operators'
import { EnvironmentRecord } from './environment-record'
import { CompletionRecord, Expression, Program, Scope, Statements } from '../types'
import { createFunction } from './create-function'
import { isIterable } from './is-iterable'
import { Directive } from '../../modules'
import setObservable from './set-observable'

type ASTNode = Program | Statements | Expression

type Handlers = {
  [N in ASTNode as N['type']]?: (
    node: N,
    env: Scope,
    directive: Directive | null,
    options: Record<string, any>
  ) => CompletionRecord | undefined
}

const handlers: Handlers = {
  Identifier(node, env, directive) {
    const { name } = node

    if (!(env instanceof EnvironmentRecord)) setObservable(name, env, directive)

    return {
      type: 'NORMAL',
      value:
        env instanceof EnvironmentRecord ? env.get(name, directive) : (env as any)[name],
    }
  },
  Literal(node) {
    return {
      type: 'NORMAL',
      value: node.value,
    }
  },
  // case 'break_stmt':
  BreakStatement(node) {
    return {
      type: 'BREAK',
      target: node.label?.name,
    }
  },
  // case 'prog':
  Program(node, env, directive, options) {
    let result

    for (const stmt of node.body) result = interpret(stmt, env, directive, options)

    return result
  },
  // case 'block_stmt':
  BlockStatement(node, env, directive, options) {
    let value: CompletionRecord | undefined

    for (const stmt of node.body) {
      value = interpret(stmt, env, directive, options)

      if (value && value.type === 'BREAK') return value
    }

    return {
      type: 'NORMAL',
      value: value?.value,
    }
  },
  // case 'return_stmt':
  ReturnStatement(node, env, directive, options) {
    return {
      type: 'RETURN',
      value: node.argument
        ? interpret(node.argument, env, directive, options)?.value
        : undefined,
    }
  },
  // case 'exp_stmt':
  ExpressionStatement(node, env, directive, options) {
    return {
      type: 'NORMAL',
      value: interpret(node.expression, env, directive, options)?.value,
    }
  },
  // case 'for_of_stmt':
  ForOfStatement(node, env, directive, options) {
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
  },
  // case 'for_stmt':
  ForStatement(node, env, directive, options) {
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
  },
  // case 'while_stmt':
  WhileStatement(node, env, directive, options) {
    const scope = new EnvironmentRecord(env as EnvironmentRecord)

    while (interpret(node.test, scope, directive, options)?.value) {
      const result = interpret(node.body, scope, directive, options)

      if (result?.type === 'BREAK') break

      if (result?.type === 'CONTINUE') continue
    }

    return {
      type: 'NORMAL',
    }
  },
  // case 'if_stmt':
  IfStatement(node, env, directive, options) {
    return {
      type: 'NORMAL',
      value: interpret(node.test, env, directive, options)?.value
        ? interpret(node.consequent, env, directive, options)?.value
        : node.alternate
        ? interpret(node.alternate, env, directive, options)?.value
        : undefined,
    }
  },
  // case 'binary_exp':
  BinaryExpression(node, env, directive, options) {
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
  },
  LogicalExpression(node, env, directive, options) {
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
  },
  // case 'update_exp':
  UpdateExpression(node, env) {
    switch (node.argument.type) {
      case 'Identifier': {
        return {
          type: 'NORMAL',
          value: env.set(
            node.argument.name,
            UnaryOperations[node.operator](env.get(node.argument.name))
          ),
        }
      }
      default:
        throw SyntaxError('SyntaxError: Invalid left-hand side in assignment')
    }
  },
  // case 'unary_exp':
  UnaryExpression(node, env, directive, options) {
    const op = UnaryOperations[node.operator]

    if (!op) throw Error(`Unary operator "${node.operator}" not supported`)

    return {
      type: 'NORMAL',
      value: op(interpret(node.argument, env, directive, options)?.value, env),
    }
  },
  // case 'member_exp':
  MemberExpression(node, env, directive, options) {
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
  },
  // case 'object_exp':
  ObjectExpression(node, env, directive, options) {
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
  },
  // case 'array_exp':
  ArrayExpression(node, env, directive, options) {
    return {
      type: 'NORMAL',
      value: node.elements.map(el => interpret(el, env, directive, options)?.value),
    }
  },
  // case 'call_exp':
  CallExpression(node, env, directive, options) {
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
  },
  // case 'conditional_exp':
  ConditionalExpression(node, env, directive, options) {
    return {
      type: 'NORMAL',
      value: interpret(node.test, env, directive, options)?.value
        ? interpret(node.consequent, env, directive, options)?.value
        : interpret(node.alternate, env, directive, options)?.value,
    }
  },
  // case 'assign_exp':
  AssignmentExpression(node, env, directive, options) {
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
  },
  // case 'func_exp':
  FunctionExpression(node, env) {
    const func = createFunction(node, env)

    return {
      type: 'NORMAL',
      value: func,
    }
  },
  ThisExpression(_node, env) {
    return {
      type: 'NORMAL',
      value: env.get('this'),
    }
  },
  // case 'func_decl':
  FunctionDeclaration(node, env) {
    const func = createFunction(node, env)

    return {
      type: 'NORMAL',
      value: env.createImmutableBinding(node.id?.name, func),
    }
  },
  // case 'var_decl':
  VariableDeclaration(node, env, directive, options) {
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
  },
  // case 'var_declr':
  VariableDeclarator(node, env, directive, options) {
    return {
      type: 'NORMAL',
      value: node.init ? interpret(node.init, env, directive, options)?.value : undefined,
    }
  },
}

export function interpret(
  node: ASTNode,
  env: Scope = new EnvironmentRecord(),
  directive: Directive | null = null,
  options: Record<string, any> = {}
): CompletionRecord | undefined {
  const handler = handlers[node.type]

  if (handler) return handler(node as any, env, directive, options)

  throw SyntaxError(`SyntaxError: Unexpected node type ${node.type}`)
}
