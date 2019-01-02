class Environment {
  constructor(parent) {
    this.vars = Object.create(parent ? parent.vars : null)
    this.parent = parent
  }
  extend() {
    return new Environment(this)
  }
  lookup(name) {
    let scope = this
    while (scope) {
      if (Reflect.has(scope.vars, name)) {
        return scope
      }
      scope = scope.parent
    }
  }
  get(name) {
    if (name in this.vars) {
      return this.vars[name]
    }
    throw new Error('Undefined variable ' + name)
  }
  set(name, value) {
    const scope = this.lookup(name)
    // let's not allow defining globals from a nested environment
    if (!scope && this.parent) {
      throw new Error('Undefined variable ' + name)
    }
    return ((scope || this).vars[name] = value)
  }
  def(name, value) {
    return (this.vars[name] = value)
  }
}
const evaluate = (exp, env) => {
  switch (exp.type) {
    case 'num':
    case 'str':
    case 'bool':
      return exp.value
    case 'var':
      return env.get(exp.value)
    case 'assign':
      if (exp.left.type != 'var') {
        throw new Error('Cannot assign to ' + JSON.stringify(exp.left))
      }
      return env.set(exp.left.value, evaluate(exp.right, env))
    case 'binary':
      return apply_operator(
        exp.operator,
        evaluate(exp.left, env),
        evaluate(exp.right, env)
      )
    case 'lambda':
      return make_lambda(env, exp)
    case 'if':
      const cond = evaluate(exp.cond, env)
      if (cond !== false) {
        return evaluate(exp.then, env)
      }
      return exp.else ? evaluate(exp.else, env) : false
    case 'prog':
      let val = false
      exp.prog.forEach(exp => (val = evaluate(exp, env)))
      return val
    case 'call':
      const func = evaluate(exp.func, env)
      return func.apply(null, exp.args.map(arg => evaluate(arg, env)))
    default:
      throw new Error("I don't know how to evaluate " + exp.type)
  }
}
const apply_operator = (op, left, right) => {
  const num = x => {
    if (typeof x != 'number') {
      throw new Error('Expected number but got ' + x)
    }
    return x
  }
  const div = x => {
    if (num(x) == 0) {
      throw new Error('Divide by zero')
    }
    return x
  }
  switch (op) {
    case '+':
      return num(left) + num(right)
    case '-':
      return num(left) - num(right)
    case '*':
      return num(left) * num(right)
    case '/':
      return num(left) / div(right)
    case '%':
      return num(left) % div(right)
    case '&&':
      return left !== false && right
    case '||':
      return left !== false ? left : right
    case '<':
      return num(left) < num(right)
    case '>':
      return num(left) > num(right)
    case '<=':
      return num(left) <= num(right)
    case '>=':
      return num(left) >= num(right)
    case '==':
      return left === right
    case '!=':
      return left !== right
  }
  throw new Error("Can't apply operator " + op)
}
const make_lambda = (env, exp) => {
  function lambda() {
    const names = exp.vars
    const scope = env.extend()
    for (let i = 0; i < names.length; ++i) {
      scope.def(names[i], i < arguments.length ? arguments[i] : false)
    }
    return evaluate(exp.body, scope)
  }
  return lambda
}
const InputStream = input => {
  let pos = 0
  let line = 1
  let col = 0
  const next = () => {
    let ch = input.charAt(pos++)
    if (ch === '\n') {
      line += 1
      col = 0
    } else {
      col += 1
    }
    return ch
  }
  const peek = () => input.charAt(pos)
  const eof = () => !peek()
  const croak = msg => {
    throw new Error(`${msg} (${line}:${col})`)
  }
  return {
    next,
    peek,
    eof,
    croak
  }
}
const TokenStream = input => {
  let current = null
  let keywords = ['if', 'then', 'else', 'true', 'false', 'function', 'lambda']
  const croak = input.croak
  const is_keyword = ch => keywords.indexOf(ch) > -1
  const is_digit = ch => /\d/.test(ch)
  const is_identifier_start = ch => /[a-z]/.test(ch)
  const is_identifier = ch => is_identifier_start(ch) || '-0123456789'.indexOf(ch) > -1
  const is_operator_char = ch => '+-*/%=&|<>!'.indexOf(ch) > -1
  const is_punctuation = ch => ',;(){}[]'.indexOf(ch) > -1
  const is_whitespace = ch => ' \t\n'.indexOf(ch) > -1
  const read_while = predicate => {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
  }
  const read_number = () => {
    let has_dot = false
    let number = read_while(ch => {
      if (ch === '.') {
        if (has_dot) {
          return false
        }
        has_dot = true
        return true
      }
      return is_digit(ch)
    })
    return {
      type: 'num',
      value: parseFloat(number)
    }
  }
  const read_identifier = () => {
    let id = read_while(is_identifier)
    return {
      type: is_keyword(id) ? 'kw' : 'var',
      value: id
    }
  }
  const read_escaped = end => {
    let escaped = false
    let str = ''
    input.next()
    while (!input.eof()) {
      let ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === end) {
        break
      } else {
        str += ch
      }
    }
    return str
  }
  const read_string = () => ({
    type: 'str',
    value: read_escaped('"')
  })
  const skip_comment = () => {
    read_while(ch => ch !== '\n')
    input.next()
  }
  const read_next = () => {
    read_while(is_whitespace)
    if (input.eof()) {
      return null
    }
    let ch = input.peek()
    if (ch === '#') {
      skip_comment()
      return read_next()
    }
    if (ch === '"') {
      return read_string()
    }
    if (is_digit(ch)) {
      return read_number()
    }
    if (is_identifier_start(ch)) {
      return read_identifier()
    }
    if (is_punctuation(ch)) {
      return {
        type: 'punc',
        value: input.next()
      }
    }
    if (is_operator_char(ch)) {
      return {
        type: 'op',
        value: read_while(is_operator_char)
      }
    }
    input.croak(`Unrecognized charactar: ${ch}`)
  }
  const peek = () => current || (current = read_next())
  const next = () => {
    let tok = current
    current = null
    return tok || read_next()
  }
  const eof = () => peek() === null
  return {
    next,
    peek,
    eof,
    croak
  }
}
const FALSE = {
  type: 'bool',
  value: false
}
const parse = input => {
  const PRECEDENCE = {
    '=': 1,
    '||': 2,
    '&&': 3,
    '<': 7,
    '>': 7,
    '<=': 7,
    '>=': 7,
    '==': 7,
    '===': 7,
    '!=': 7,
    '+': 10,
    '-': 10,
    '*': 20,
    '/': 20,
    '%': 20
  }
  const is_punctuation = ch => {
    const tok = input.peek()
    return tok && tok.type === 'punc' && (!ch || tok.value === ch) && tok
  }
  const is_kw = kw => {
    const tok = input.peek()
    return tok && tok.type === 'kw' && (!kw || tok.value === kw) && tok
  }
  const is_operator = op => {
    const tok = input.peek()
    return tok && tok.type === 'op' && (!op || tok.value === op) && tok
  }
  const skip_punc = ch => {
    if (is_punctuation(ch)) {
      input.next()
    } else {
      input.croak(`Expecting operator: "${ch}"`)
    }
  }
  const skip_kw = kw => {
    if (is_kw(kw)) {
      input.next()
    } else {
      input.croak(`Expecting operator: "${kw}"`)
    }
  }
  // This isn't used?
  const skip_operator = op => {
    if (is_operator(op)) {
      input.next()
    } else {
      input.croak(`Expecting operator: "${op}"`)
    }
  }
  const unexpected = () =>
    input.croak(`Unexpected token: ${JSON.stringify(input.peek())}`)
  const maybe_binary = (left, my_prec) => {
    const tok = is_operator()
    if (tok) {
      const his_prec = PRECEDENCE[tok.value]
      if (his_prec > my_prec) {
        input.next()
        return maybe_binary(
          {
            type: tok.value == '=' ? 'assign' : 'binary',
            operator: tok.value,
            left: left,
            right: maybe_binary(parse_atom(), his_prec)
          },
          my_prec
        )
      }
    }
    return left
  }
  const delimited = (start, stop, separator, parser) => {
    const a = []
    let first = true
    skip_punc(start)
    while (!input.eof()) {
      if (is_punctuation(stop)) {
        break
      }
      if (first) {
        first = false
      } else {
        skip_punc(separator)
      }
      if (is_punctuation(stop)) {
        break
      }
      a.push(parser())
    }
    skip_punc(stop)
    return a
  }
  const parse_call = func => ({
    type: 'call',
    func: func,
    args: delimited('(', ')', ',', parse_expression)
  })
  const parse_varname = () => {
    const name = input.next()
    if (name.type != 'var') {
      input.croak('Expecting variable name')
    }
    return name.value
  }
  const parse_if = () => {
    skip_kw('if')
    const cond = parse_expression()
    if (!is_punctuation('{')) {
      skip_kw('then')
    }
    const then = parse_expression()
    const ret = {
      type: 'if',
      cond: cond,
      then: then
    }
    if (is_kw('else')) {
      input.next()
      ret.else = parse_expression()
    }
    return ret
  }
  const parse_lambda = () => ({
    type: 'lambda',
    vars: delimited('(', ')', ',', parse_varname),
    body: parse_expression()
  })
  const parse_bool = () => ({
    type: 'bool',
    value: input.next().value == 'true'
  })
  const maybe_call = expr => {
    expr = expr()
    return is_punctuation('(') ? parse_call(expr) : expr
  }
  const parse_atom = () =>
    maybe_call(() => {
      if (is_punctuation('(')) {
        input.next()
        var exp = parse_expression()
        skip_punc(')')
        return exp
      }
      if (is_punctuation('{')) {
        return parse_prog()
      }
      if (is_kw('if')) {
        parse_if()
      }
      if (is_kw('true') || is_kw('false')) {
        parse_bool()
      }
      if (is_kw('lambda') || is_kw('function')) {
        input.next()
        return parse_lambda()
      }
      const tok = input.next()
      if (tok.type == 'var' || tok.type == 'num' || tok.type == 'str') {
        return tok
      }
      unexpected()
    })
  const parse_toplevel = () => {
    const prog = []
    while (!input.eof()) {
      prog.push(parse_expression())
      if (!input.eof()) {
        skip_punc(';')
      }
    }
    return {
      type: 'prog',
      prog: prog
    }
  }
  const parse_prog = () => {
    const prog = delimited('{', '}', ';', parse_expression)
    if (prog.length == 0) {
      return FALSE
    }
    if (prog.length == 1) {
      return prog[0]
    }
    return {
      type: 'prog',
      prog: prog
    }
  }
  const parse_expression = () => maybe_call(() => maybe_binary(parse_atom(), 0))
  return parse_toplevel()
}
export { InputStream, TokenStream, parse, Environment, evaluate }
