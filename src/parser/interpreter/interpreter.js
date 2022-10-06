import Environment from '@digitalbranch/early-parser/src/Environment'
import evalExp from './evalExp'
import setObservable from './setObservable'

class Interpreter {
  constructor(AST) {
    const [program] = AST

    this.AST = program.body
  }

  interpret(env = new Environment(), directive = null) {
    let [result] = evalExp(this.AST, env, directive)

    if (result && result.type && result.type === 'Identifier') {
      const { name } = result

      result = env.this.data ? env.this.data[name] : env.this[name].data || undefined

      setObservable(name, env, directive)
    }

    return result === undefined ? '' : result
  }
}
export default Interpreter
