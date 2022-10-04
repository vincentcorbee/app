export const unaryOperations = {
  '+': a => +a,
  '-': a => -a,
}

export const assignOperations = {
  '=': (a, b, env) => env.set(a, b),
  '+=': (a, b, env) => env.set(a, env.get(a) + b),
  '-=': (a, b, env) => env.set(a, env.get(a) - b),
  '*=': (a, b, env) => env.set(a, env.get(a) * b),
  '/=': (a, b, env) => env.set(a, env.get(a) / b),
  '%=': (a, b, env) => env.set(a, env.get(a) - b),
  '<<=': (a, b, env) => env.set(a, env.get(a) << b),
  '>>=': (a, b, env) => env.set(a, env.get(a) >> b),
  '&=': (a, b, env) => env.set(a, env.get(a) & b),
  '^=': (a, b, env) => env.set(a, env.get(a) ^ b),
  '|=': (a, b, env) => env.set(a, env.get(a) | b),
}

export const binaryOperations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '===': (a, b) => a === b,
  '==': (a, b) => a == b,
  '!==': (a, b) => a !== b,
  '!=': (a, b) => a != b,
  '&&': (a, b) => a && b,
  '||': (a, b) => a || b,
  '|': (a, b) => a | b,
  '&': (a, b) => a & b,
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
}
