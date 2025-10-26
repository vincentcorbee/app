import { EMPTY, GrammarRules } from '@digitalbranch/earley-parser'
import {
  createArrowExpressionNode,
  createAssignmentExpressionNode,
  createBinaryOrUpdateExpressionNode,
  createBlockStatementNode,
  createConditionalExpressionNode,
  createFunctionBodyNode,
  createFunctionDeclarationNode,
  createLeafNode,
  createLiteralNode,
  createLogicalExpressionNode,
  createNodeList,
  createObjectExpressionNode,
  createProgramNode,
  createReturnStatementNode,
  createSequenceExpressionNode,
  createThisExpressionNode,
  createUpdateExpressionNode,
  createUpdateOrUnaryExpressionNode,
  pickChild,
  returnChildren,
  returnValueFromNode,
  skipNode,
} from './actions/actions'

const grammar = [
  /* Programs */
  {
    exp: `Program :
        SourceElements`,
    action: createProgramNode,
  },
  {
    exp: `SourceElements :
        SourceElement
      | SourceElements SourceElement`,
    action: skipNode,
  },
  {
    exp: `SourceElement : Statement`,
    action: skipNode,
  },
  /* Postfix Operators */
  {
    exp: `PostfixExpression :
        LeftSideExpression
      | LeftSideExpression INCREMENT
      | LeftSideExpression DECREMENT`,
    action: ({ children = [], ...rest }) => {
      if (children.length === 2) {
        return createUpdateExpressionNode({
          children: [children[0], children[1]],
          ...rest,
        })
      }

      return children
    },
  },
  /* Statements */
  {
    exp: 'OptSemi : SEMI',
    action: () => null,
  },
  /* Statements */
  {
    exp: `Statement :
        EmptyStatement
      | ExpressionStatement OptSemi
      | ReturnStatement OptSemi`,
    action: ({ children = [] }) => children[0],
  },
  /* Empty Statement */
  {
    exp: 'EmptyStatement : SEMI',
    action: ({ type }) => ({ type }),
  },
  {
    exp: `ExpressionStatement : Expression`,
    action: ({ type, children = [], start, end }) => ({
      type,
      start,
      end,
      expression: children[0],
    }),
  },
  /* Return Statement */
  {
    exp: 'ReturnStatement : RETURN OptionalExpression',
    action: createReturnStatementNode,
  },
  /* Block Statement*/
  {
    exp: `Block : LCBRACE BlockStatements RCBRACE`,
    action: createBlockStatementNode,
  },
  {
    exp: `BlockStatements :
        ${EMPTY}
      | BlockStatementsPrefix`,
    action: returnChildren,
  },
  {
    exp: `BlockStatementsPrefix :
        Statement
      | BlockStatementsPrefix Statement`,
    action: skipNode,
  },
  {
    exp: `Expression :
        AssignmentExpression
      | SequenceExpression`,
    action: skipNode,
  },
  {
    exp: `OptionalExpression :
        Expression
      | ${EMPTY}`,
    action: skipNode,
  },
  {
    exp: `SequenceExpression : Expression COMMA AssignmentExpression`,
    action: createSequenceExpressionNode,
  },
  {
    exp: `AssignmentExpression :
        ConditionalExpression
      | ArrowFunction
      | LeftSideExpression EQUAL AssignmentExpression
      | LeftSideExpression CompoundAssignment AssignmentExpression`,
    action: createAssignmentExpressionNode,
  },
  {
    exp: `CompoundAssignment :
        "*="
      | "/="
      | "%="
      | "+="
      | "-="
      | "<<="
      | ">>="
      | ">>>="
      | "&="
      | "^="
      | "|="`,
    action: returnValueFromNode,
  },
  {
    exp: `ConditionalExpression :
        LogicalOrExpression
      | LogicalOrExpression TENARY AssignmentExpression PERIOD AssignmentExpression`,
    action: createConditionalExpressionNode,
  },
  {
    exp: `LogicalOrExpression :
        LogicalAndExpression
      | LogicalOrExpression LOGOR LogicalAndExpression`,
    action: createLogicalExpressionNode,
  },
  {
    exp: `LogicalAndExpression :
        BitwiseOrExpression
      | LogicalAndExpression LOGAND BitwiseOrExpression`,
    action: createLogicalExpressionNode,
  },

  {
    exp: `BitwiseOrExpression :
        BitwiseXorExpression
      | BitwiseOrExpression BINOR BitwiseXorExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },

  {
    exp: `BitwiseXorExpression :
        BitwiseAndExpression
      | BitwiseXorExpression XOR BitwiseAndExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },
  {
    exp: `BitwiseAndExpression :
        EqualityExpression
      | BitwiseAndExpression BINAND EqualityExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },

  {
    exp: `EqualityExpression :
        RelationalExpression
      | EqualityExpression EQUALEQUAL RelationalExpression
      | EqualityExpression NOTEQUAL RelationalExpression
      | EqualityExpression STRICTEQUAL RelationalExpression
      | EqualityExpression NOTSTRICTEQUAL RelationalExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },
  {
    exp: `RelationalExpression :
        ShiftExpression
      | RelationalExpression LT ShiftExpression
      | RelationalExpression GT ShiftExpression
      | RelationalExpression LTEQ ShiftExpression
      | RelationalExpression GTEQ ShiftExpression
      | RelationalExpression INSTANCEOF ShiftExpression
      | RelationalExpression IN ShiftExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },
  {
    exp: `ShiftExpression :
        AdditiveExpression
      | ShiftExpression "<<" AdditiveExpression
      | ShiftExpression ">>" AdditiveExpression
      | ShiftExpression ">>>" AdditiveExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },
  {
    exp: `AdditiveExpression :
        MultiplicativeExpression
      | AdditiveExpression PLUS MultiplicativeExpression
      | AdditiveExpression MINUS MultiplicativeExpression`,
    action: createBinaryOrUpdateExpressionNode,
  },
  {
    exp: `MultiplicativeExpression :
        UnaryExpression
      | MultiplicativeExpression MULTIPLY UnaryExpression
      | MultiplicativeExpression MODULUS UnaryExpression`,
    action: skipNode,
  },
  {
    exp: `UnaryExpression :
        PostfixExpression
      | INCREMENT LeftSideExpression
      | DECREMENT LeftSideExpression
      | PLUS UnaryExpression
      | MINUS UnaryExpression
      | LOGNOT UnaryExpression
      | NOT UnaryExpression`,
    action: node => {
      if (node.children?.length === 1) return skipNode(node)

      return createUpdateOrUnaryExpressionNode(node)
    },
  },
  {
    exp: 'Identifier : IDENTIFIER',
    action: createLeafNode,
  },
  {
    exp: `BindingIdentifier : Identifier`,
    action: skipNode,
  },
  {
    exp: 'Number : NUMBER',
    action: createLiteralNode,
  },
  {
    exp: 'StringLiteral : STRING',
    action: createLiteralNode,
  },
  {
    exp: 'Null : NULL',
    action: createLiteralNode,
  },
  {
    exp: 'This : THIS',
    action: createThisExpressionNode,
  },
  {
    exp: 'Boolean : TRUE | FALSE',
    action: createLiteralNode,
  },

  /* Left-Side expression */
  {
    exp: `LeftSideExpression : CallExpression`,
    action: skipNode,
  },
  {
    exp: `CallExpression :
        PrimaryExpression
      | CallExpression Arguments
      | CallExpression MemberOperator`,
    action: ({ children = [] }) => {
      if (children.length === 1) return children

      if (children[1].type === 'MemberOperator') {
        return {
          type: 'MemberExpression',
          property: children[1].property,
          object: children[0],
          computed: children[1].computed,
        }
      }

      if (children[1].type === 'Arguments') {
        return {
          type: 'CallExpression',
          callee: children[0],
          arguments: children[1].children,
        }
      }

      return children[1]
    },
  },
  {
    exp: `MemberOperator :
        LBRACK Expression RBRACK
      | DOT Identifier`,
    action: ({ type, children = [] }) => ({
      type,
      property: children[1],
      computed: children.length === 3,
    }),
  },
  {
    exp: `Arguments :
        LPAREN RPAREN
      | LPAREN ArgumentList RPAREN`,
    action: ({ type, children = [] }) => ({
      type,
      children: children.length === 3 ? children[1] : [],
    }),
  },
  {
    exp: `ArgumentList :
        AssignmentExpression
      | ArgumentList COMMA AssignmentExpression`,
    action: createNodeList,
  },
  /* Expressions */
  /* Primary Expressions */
  {
    exp: `PrimaryExpression :
        SimpleExpression
      | ObjectLiteral
      | FunctionExpression`,
    action: skipNode,
  },
  {
    exp: `SimpleExpression :
        This
      | Null
      | Boolean
      | StringLiteral
      | Number
      | Identifier
      | ParenthesizedExpression
      | ArrayLiteral`,
    action: skipNode,
  },
  {
    exp: 'ParenthesizedExpression : LPAREN Expression RPAREN',
    action: pickChild(1),
  },
  /* Function Expressions */
  {
    exp: `FunctionExpression :
        AnonymousFunction
      | FunctionDeclaration`,
    action: ({ children = [] }) => {
      children[0].type = 'FunctionExpression'

      return children
    },
  },
  /* Object literals */
  {
    exp: `ObjectLiteral :
        LCBRACE RCBRACE
      | LCBRACE FieldList RCBRACE
      | LCBRACE FieldList COMMA RCBRACE`,
    action: createObjectExpressionNode,
  },
  {
    exp: `FieldList :
        PropertyDefinition
      | FieldList COMMA PropertyDefinition`,
    action: createNodeList,
  },
  {
    exp: `PropertyDefinition :
        PropertyName PERIOD AssignmentExpression`,
    action: ({ children = [] }) => ({
      type: 'Property',
      key: children[0],
      value: children[2],
      kind: 'init',
    }),
  },
  {
    exp: `PropertyName :
        LiteralPropertyName`,
    action: skipNode,
  },
  {
    exp: `LiteralPropertyName :
        Identifier | StringLiteral | Number`,
    action: skipNode,
  },
  /* Array literals  */
  {
    exp: `ArrayLiteral :
        LBRACK RBRACK
      | LBRACK ElementList RBRACK`,
    action: ({ children = [] }) => ({
      type: 'ArrayExpression',
      elements: children.length === 2 ? [] : children[1],
    }),
  },

  {
    exp: `ElementList :
        LiteralElement
      | ElementList COMMA LiteralElement`,
    action: createNodeList,
  },
  {
    exp: 'LiteralElement : AssignmentExpression',
    action: skipNode,
  },
  /* Function Declaration */
  {
    exp: 'FunctionDeclaration : FUNCTION Identifier FormalParametersListAndBody',
    action: createFunctionDeclarationNode,
  },
  {
    exp: 'AnonymousFunction : FUNCTION FormalParametersListAndBody',
    action: ({ type, children = [] }) => ({
      type,
      id: null,
      params: children[0],
      body: children[1],
    }),
  },
  {
    exp: 'FormalParametersListAndBody : LPAREN FormalParameterList RPAREN LCBRACE FunctionBody RCBRACE',
    action: ({ children = [] }) => [children[1], children[4]],
  },
  {
    exp: 'FunctionBody : SourceElements',
    action: createFunctionBodyNode,
  },
  {
    exp: `FormalParameterList :
        ${EMPTY}
      | Identifier
      | FormalParameterList COMMA Identifier`,
    action: createNodeList,
  },
  {
    exp: `ArrowFunction : ArrowParameters ARROW ConciseBody`,
    action: createArrowExpressionNode,
  },
  {
    exp: `ArrowParameters :
        BindingIdentifier
     |  CoverParenthesizedExpressionAndArrowParameterList`,
    action: skipNode,
  },
  {
    exp: `ConciseBody :
        AssignmentExpression
      | LCBRACE FunctionBody RCBRACE`,
    action: ({ children = [] }) =>
      children.length === 1
        ? children[0]
        : {
            type: 'BlockStatement',
            body: children[1],
          },
  },
  {
    exp: `CoverParenthesizedExpressionAndArrowParameterList : ArrowFormalParameters`,
    action: skipNode,
  },
  {
    exp: `ArrowFormalParameters : LPAREN StrictFormalParameters RPAREN`,
    action: pickChild(1),
  },
  {
    exp: `StrictFormalParameters : FormalParameters`,
    action: skipNode,
  },
  {
    exp: `FormalParameters :
        ${EMPTY}
      | FormalParameterList`,
    action: skipNode,
  },
  {
    exp: `FormalParameterList :
        ${EMPTY}
      | Identifier
      | FormalParameterList COMMA Identifier`,
    action: createNodeList,
  },
] as GrammarRules
export default grammar
