import { ParseTreeNode, SemanticAction } from '@digitalbranch/earley-parser'
import {
  ArrowFunctionExpression,
  AssignmentExpression,
  BinaryExpression,
  BlockStatement,
  ConditionalExpression,
  Directive,
  ExpressionStatement,
  FunctionBody,
  FunctionDeclaration,
  Identifier,
  Literal,
  LogicalExpression,
  ObjectExpression,
  Pattern,
  Program,
  ReturnStatement,
  SequenceExpression,
  Statements,
  ThisExpression,
  UnaryExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
} from '../types'

export const pickChild =
  (index: number): SemanticAction =>
  ({ children = [] }) =>
    children[index]

export const createProgramNode: SemanticAction<Program> = ({
  start,
  end,
  children = [],
}) => {
  const sourceType = children.find(child => child?.type === 'ImportDeclaration')
    ? 'module'
    : 'script'

  return {
    type: 'Program',
    sourceType,
    loc: {
      source: null,
      start,
      end,
    },
    body: children,
  }
}

export const createReturnStatementNode: SemanticAction<ReturnStatement> = ({
  children = [],
}) => ({
  type: 'ReturnStatement',
  argument: children[1] || null,
})

export const createExpressionStatementNode: SemanticAction<ExpressionStatement> = ({
  children = [],
}) => ({
  type: 'ExpressionStatement',
  expression: children[0],
})

export const createBlockStatementNode: SemanticAction<BlockStatement> = ({
  children = [],
}) => ({
  type: 'BlockStatement',
  body: children[1],
})

export const createArrowExpressionNode: SemanticAction<ArrowFunctionExpression> = ({
  children = [],
}) => {
  console.log(children)
  return {
    type: 'ArrowFunctionExpression',
    id: children[0],
    params: children[1],
    body: children[2],
    expression: false,
    generator: false,
  }
}

export const createSequenceExpressionNode: SemanticAction<SequenceExpression> = ({
  children = [],
}) => ({
  type: 'SequenceExpression',
  expressions: [children[0], children[2]],
})

export const createAssignmentExpressionNode: SemanticAction<AssignmentExpression> = ({
  children = [],
}) => {
  const [left, operator, right] = children

  if (children.length === 1) return left

  return {
    type: 'AssignmentExpression',
    operator,
    left,
    right,
  }
}

export const createUpdateOrUnaryExpressionNode: SemanticAction<
  UpdateExpression | UnaryExpression
> = node => {
  const { children = [], ...rest } = node

  if (['++', '--'].includes(children[0].value))
    return createUpdateExpressionNode({
      children: [children[1], children[0]],
      ...rest,
    })

  return createUnaryExpressionNode(node)
}

export const createUnaryExpressionNode: SemanticAction<UnaryExpression> = ({
  children = [],
}) => {
  const [operator, argument] = children

  return {
    type: 'UnaryExpression',
    operator: operator.value,
    argument,
    prefix: false,
  }
}

export const createUpdateExpressionNode: SemanticAction<UpdateExpression> = ({
  children = [],
}) => {
  const [argument, operator] = children

  return {
    type: 'UpdateExpression',
    operator: operator.value,
    argument,
    prefix: false,
  }
}

export const createBinaryOrUpdateExpressionNode: SemanticAction<
  BinaryExpression | UpdateExpression
> = ({ children = [], ...rest }) => {
  const [left, operator, right] = children!

  if (children!.length === 1) return left

  if (children!.length === 2) return createUpdateExpressionNode({ children, ...rest })

  return {
    type: 'BinaryExpression',
    operator: operator.value,
    left,
    right,
  }
}

export const createLogicalExpressionNode: SemanticAction<LogicalExpression> = ({
  children = [],
}) => {
  const [left, operator, right] = children

  if (children!.length === 1) return left

  return {
    type: 'LogicalExpression',
    operator: operator.value,
    left,
    right,
  }
}

export const createConditionalExpressionNode: SemanticAction<ConditionalExpression> = ({
  children = [],
}) => {
  if (children.length === 1) return children[0]

  return {
    type: 'ConditionalExpression',
    test: children[0],
    consequent: children[2],
    alternate: children[4],
  }
}

export const createLeafNode: SemanticAction = ({ children = [], type }) => {
  const { value: name } = children[0]

  return {
    type,
    name,
  }
}

export const createIdentifierNode: SemanticAction<Identifier> = ({ children = [] }) => {
  const { value: name } = children[0]

  return {
    type: 'Identifier',
    name,
  }
}

export const createLiteralNode: SemanticAction<Literal> = ({ children = [] }) => {
  const { value } = children[0]

  return {
    type: 'Literal',
    value,
  }
}

export const skipNode: SemanticAction = ({ children = [] }) => children

export const returnChildren: SemanticAction<any[]> = ({ children = [] }) => [children]

export const returnValueFromNode: SemanticAction<any> = ({ children = [] }) =>
  children[0].value

export const createNodeList: SemanticAction<any[]> = ({ children = [] }) => {
  const list = []

  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    if (child.value !== ',') {
      Array.isArray(child) ? list.push(...child) : list.push(child)
    }
  }

  return [list]
}

export const createObjectExpressionNode: SemanticAction<ObjectExpression> = ({
  children = [],
}) => {
  const properties = children[1] ?? []

  return {
    type: 'ObjectExpression',
    properties,
  }
}

export const createThisExpressionNode: SemanticAction<ThisExpression> = () => {
  return {
    type: 'ThisExpression',
  }
}
export const createVariableDeclarationNode: SemanticAction<VariableDeclaration> = ({
  children = [],
}) => {
  const [kind, declarations] = children

  return {
    type: 'VariableDeclaration',
    kind,
    declarations,
  }
}

export const createVariableDeclaratorNode: SemanticAction<VariableDeclarator> = ({
  children = [],
}) => {
  const [id] = children

  const node: VariableDeclarator = {
    type: 'VariableDeclarator',
    id,
    init: null,
  }

  return node
}

export const createFunctionDeclarationNode: SemanticAction<FunctionDeclaration> = ({
  children = [],
}) => {
  console.log(children)
  return {
    type: 'FunctionDeclaration',
    id: children[1] as Identifier,
    params: children[2] as unknown as Identifier[],
    body: children[3] as FunctionBody,
    generator: false,
  }
}

export const createFunctionBodyNode: SemanticAction<FunctionBody> = ({
  children = [],
}) => {
  return {
    type: 'BlockStatement',
    body: children as Array<Directive | Statements>,
  }
}
