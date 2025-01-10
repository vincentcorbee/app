import { FunctionExpression, FunctionDeclaration } from '../types/nodes.types'
import { EnvironmentRecord } from './environment-record'
import { interpret } from './interpret'
import { Scope } from '../types'

export function createFunction(
  node: FunctionExpression | FunctionDeclaration,
  env: Scope
): Function {
  return function () {
    const scope = new EnvironmentRecord(env instanceof EnvironmentRecord ? env : null)
    node.params.forEach((param, i) =>
      scope.createMutableBinding(param.name, arguments[i])
    )

    return interpret(node.body, scope)?.value
  }
}
