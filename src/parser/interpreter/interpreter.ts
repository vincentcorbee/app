import { Environment } from './environment'
import evalExpression from './eval-expression'
import { Directive } from '../../modules'
import { interpret } from './interpret'
import { EnvironmentRecord } from './environment-record'

class Interpreter {
  AST: any

  constructor(AST?: any) {
    if (AST) {
      const [program] = AST

      this.AST = program.body
    } else {
      this.AST = null
    }
  }

  interpret(AST: any, env = new Environment(), directive: Directive | null = null) {
    try {
      const [program] = AST

      // const [result] = evalExpression(program.body, env, directive)

      const value = interpret(
        program,
        new EnvironmentRecord(null, {
          this: { value: env.this, mutable: false },
          console: { value: console, mutable: false },
        }),
        directive
      )?.value

      return value
    } catch (error) {
      console.error(error)

      return ''
    }
  }
}
export default Interpreter
