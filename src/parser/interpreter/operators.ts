import {
  BinaryOperation,
  // BinaryOperator,
  // Scope,
  UnaryOperation,
  UnaryOperator,
  UpdateOperator,
} from '../types'

export const BinaryOperations = {
  '==': (lhs: any, rhs: any) => lhs === rhs,
  '!=': (lhs: any, rhs: any) => lhs === rhs,
  '===': (lhs: any, rhs: any) => lhs === rhs,
  '!==': (lhs: any, rhs: any) => lhs === rhs,
  '+': (lhs: any, rhs: any) => lhs + rhs,
  '-': (lhs: any, rhs: any) => lhs - rhs,
  '*': (lhs: any, rhs: any) => lhs * rhs,
  '%': (lhs: any, rhs: any) => lhs % rhs,
  '/': (lhs: any, rhs: any) => lhs / rhs,
  '>': (lhs: any, rhs: any) => lhs > rhs,
  '<': (lhs: any, rhs: any) => lhs < rhs,
  '&&': (lhs: any, rhs: any) => lhs && rhs,
  '&': (lhs: any, rhs: any) => lhs & rhs,
  '||': (lhs: any, rhs: any) => lhs || rhs,
  '|': (lhs: any, rhs: any) => lhs | rhs,
  '>=': (lhs: any, rhs: any) => lhs >= rhs,
  '<=': (lhs: any, rhs: any) => lhs <= rhs,
} as Record<string, BinaryOperation>

export const UnaryOperations = {
  '-': (argument: any) => -argument,
  '+': (argument: any) => +argument,
  '!': (argument: any) => !argument,
  '++': (argument: any) => ++argument,
  '--': (argument: any) => --argument,
} as Record<UnaryOperator | UpdateOperator, UnaryOperation>
