type BinaryOperator = (lhs: any, rhs: any, env?: any) => any

type UnaryOperator = (argument: any, env?: any) => any

export const unaryOperations: { [key: string]: UnaryOperator } = {
  '+': (a: any) => +a,
  '-': (a: any) => -a,
} as const

export const assignOperations = {
  '=': (a: any, b: any, env: any) => env.set(a, b),
  '+=': (a: any, b: any, env: any) => env.set(a, env.get(a) + b),
  '-=': (a: any, b: any, env: any) => env.set(a, env.get(a) - b),
  '*=': (a: any, b: any, env: any) => env.set(a, env.get(a) * b),
  '/=': (a: any, b: any, env: any) => env.set(a, env.get(a) / b),
  '%=': (a: any, b: any, env: any) => env.set(a, env.get(a) - b),
  '<<=': (a: any, b: any, env: any) => env.set(a, env.get(a) << b),
  '>>=': (a: any, b: any, env: any) => env.set(a, env.get(a) >> b),
  '&=': (a: any, b: any, env: any) => env.set(a, env.get(a) & b),
  '^=': (a: any, b: any, env: any) => env.set(a, env.get(a) ^ b),
  '|=': (a: any, b: any, env: any) => env.set(a, env.get(a) | b),
} as const

export const binaryOperations: { [key: string]: BinaryOperator } = {
  '+': (a: any, b: any) => a + b,
  '-': (a: any, b: any) => a - b,
  '*': (a: any, b: any) => a * b,
  '/': (a: any, b: any) => a / b,
  '===': (a: any, b: any) => a === b,
  '==': (a: any, b: any) => a == b,
  '!==': (a: any, b: any) => a !== b,
  '!=': (a: any, b: any) => a != b,
  '&&': (a: any, b: any) => a && b,
  '||': (a: any, b: any) => a || b,
  '|': (a: any, b: any) => a | b,
  '&': (a: any, b: any) => a & b,
  '<': (a: any, b: any) => a < b,
  '>': (a: any, b: any) => a > b,
  '>=': (a: any, b: any) => a >= b,
  '<=': (a: any, b: any) => a <= b,
} as const
