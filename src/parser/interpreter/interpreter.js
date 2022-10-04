import Environment from 'early-parser/src/Environment'
import evalExp from './evalExp'
import setObservable from './setObservable'

class Interpreter {
  constructor(AST) {
    const self = this

    self.AST = AST[0]
  }

  interpret(env = new Environment(), directive = null) {
    const self = this
    let val = evalExp(self.AST, env, directive)[0].pop()

    if (val && val.type && val.type === 'identifier') {
      const [prop] = val

      val = env.this.data ? env.this.data[prop] : env.this[prop].data || undefined

      setObservable(prop, env, directive)
    }

    return val === undefined ? '' : val
  }
}
export default Interpreter
