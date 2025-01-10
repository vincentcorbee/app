export type ESTreeNodeType =
  | 'BinaryExpression'
  | 'Literal'
  | 'Identifier'
  | 'CallExpression'
  | 'MemberExpression'
  | 'AssignmentExpression'
  | 'UnaryExpression'
  | 'ConditionalExpression'
  | 'UpdateExpression'
  | 'ExpressionStatement'
  | 'ArrowFunctionExpression'
  | 'LogicalExpression'
  | 'SequenceExpression'
  | 'BlockStatement'
  | 'Program'
  | 'BlockStatement'
  | 'ReturnStatement'
  | 'BreakStatement'
  | 'ForStatement'
  | 'ForInStatement'
  | 'ForOfStatement'
  | 'IfStatement'
  | 'VariableDeclaration'
  | 'VariableDeclarator'
  | 'FunctionDeclaration'
  | 'FunctionExpression'
  | 'ObjectExpression'
  | 'ArrayExpression'
  | 'Property'
  | 'WhileStatement'
  | 'ThisExpression'

export type VariableKind = 'let' | 'const'

export type UnaryOperator = '-' | '+' | '!' | '~'

export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '|'
  | '^'
  | '&'
  | 'in'

export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='

export type SourceLocation = {
  source?: string | null
  start?: number
  end?: number
}

export type Position = {
  line: number
  column: number
}

export interface ESTreeNode {
  type: ESTreeNodeType
  loc?: SourceLocation | null
}

export interface Statement extends ESTreeNode {}

export interface Declaration extends Statement {}

export interface Program extends ESTreeNode {
  type: 'Program'
  sourceType: 'module' | 'script'
  body: Array<Statements>
}

export interface BinaryExpression extends ESTreeNode {
  type: 'BinaryExpression'
  operator: BinaryOperator
  left: Expression
  right: Expression
}

export interface Directive extends ExpressionStatement {
  expression: Literal
  directive: string
}

export interface UnaryExpression extends ESTreeNode {
  type: 'UnaryExpression'
  operator: UnaryOperator
  argument: Expression
  prefix: boolean
}

export interface CallExpression extends ESTreeNode {
  type: 'CallExpression'
  callee: Expression
  arguments: Array<Expression>
}

export interface MemberExpression extends ESTreeNode {
  type: 'MemberExpression'
  property: Identifier | Literal
  object: MemberExpression | Identifier
  computed: boolean
}

export interface ThisExpression extends ESTreeNode {
  type: 'ThisExpression'
}

export interface Literal extends ESTreeNode {
  type: 'Literal'
  value: string | number | boolean | null | undefined
}

export interface Identifier extends ESTreeNode {
  type: 'Identifier'
  name: string
}

export interface AssignmentExpression extends ESTreeNode {
  type: 'AssignmentExpression'
  operator: string
  left: Identifier
  right: Expression
}

export interface ConditionalExpression extends ESTreeNode {
  type: 'ConditionalExpression'
  test: Expression
  alternate: Expression
  consequent: Expression
}

export interface LogicalExpression extends ESTreeNode {
  type: 'LogicalExpression'
  operator: LogicalOperator
  left: Expression
  right: Expression
}

export type LogicalOperator = '||' | '&&'

export interface ArrowFunctionExpression extends Function {
  type: 'ArrowFunctionExpression'
  body: FunctionBody
  expression: boolean
  generator: false
}

export interface SequenceExpression extends ESTreeNode {
  type: 'SequenceExpression'
  expressions: Array<Expression>
}

export interface ExpressionStatement extends Statement {
  type: 'ExpressionStatement'
  expression: Expression
}

export interface BlockStatement extends Statement {
  type: 'BlockStatement'
  body: Array<Statements | Directive>
}

export interface ForStatement extends Statement {
  type: 'ForStatement'
  init: VariableDeclaration | Expression | null
  test: Expression | null
  update: Expression | null
  body: Statements
}

export interface ForInStatement extends Statement {
  type: 'ForInStatement'
  left: VariableDeclaration
  right: Expression
  body: Statements
}

export interface ForOfStatement extends Omit<ForInStatement, 'type'> {
  type: 'ForOfStatement'
}

export interface WhileStatement extends Statement {
  type: 'WhileStatement'
  test: Expression
  body: Statements
}

export interface IfStatement extends Statement {
  type: 'IfStatement'
  test: Expression
  consequent: Statements
  alternate: Statements | null
}

export interface VariableDeclaration extends Declaration {
  type: 'VariableDeclaration'
  declarations: VariableDeclarator[]
  kind: VariableKind
}

export type VariableStatement = VariableDeclaration

export interface VariableDeclarator extends ESTreeNode {
  type: 'VariableDeclarator'
  id: Identifier
  init: Expression | null
}

export interface ObjectExpression extends ESTreeNode {
  type: 'ObjectExpression'
  properties: Array<Property>
}

export interface ArrayExpression extends ESTreeNode {
  type: 'ArrayExpression'
  elements: Array<Expression>
}

export interface Property extends ESTreeNode {
  type: 'Property'
  key: Literal | Identifier
  value: Expression
  kind: 'init' | 'get' | 'set'
}

export interface Function extends ESTreeNode {
  id: Identifier | null
  params: Array<Identifier>
  body: FunctionBody
  generator: boolean
}

export interface FunctionDeclaration extends Function, Declaration {
  type: 'FunctionDeclaration'
  id: Identifier
}

export interface ReturnStatement extends Statement {
  type: 'ReturnStatement'
  argument: Expression | null
}

export interface BreakStatement extends ESTreeNode {
  type: 'BreakStatement'
  label: Identifier | null
}

export interface FunctionExpression extends Function, ESTreeNode {
  type: 'FunctionExpression'
}

export interface UpdateExpression extends ESTreeNode {
  type: 'UpdateExpression'
  operator: UpdateOperator
  argument: Expression
  prefix: boolean
}

export type UpdateOperator = '++' | '--'

export type FunctionBody = BlockStatement

export type Pattern = Identifier | MemberExpression

export type Statements =
  | ExpressionStatement
  | BlockStatement
  | VariableDeclaration
  | VariableDeclarator
  | FunctionDeclaration
  | ReturnStatement
  | BreakStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | IfStatement
  | WhileStatement
  | VariableStatement

export type Expression =
  | BinaryExpression
  | Literal
  | Identifier
  | CallExpression
  | MemberExpression
  | AssignmentExpression
  | ConditionalExpression
  | UnaryExpression
  | ObjectExpression
  | ArrayExpression
  | UpdateExpression
  | FunctionExpression
  | FunctionDeclaration
  | VariableDeclaration
  | LogicalExpression
  | ThisExpression
  | SequenceExpression
  | ArrowFunctionExpression
