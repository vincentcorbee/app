import { createNewElement, append } from '../lib/U'
import flattenList from './flattenList'
// Still have to implement nullable grammer rules
const _private = new WeakMap()
let I = 0
class State {
  constructor({ lhs, left, right, dot, from, action }) {
    this.lhs = lhs
    this.left = left
    this.right = right
    this.dot = dot
    this.from = from
    this.id = (State.prototype.id || 0) + 1
    this.previous = []
    this.action = action
    State.prototype.id = this.id
  }
  get complete() {
    return !this.right.length
  }
  expectNonTerminal(grammer) {
    const rhs = this.right[0]
    return rhs && grammer.some(rule => rule.lhs === rhs)
  }
}
const createIndent = index => {
  let cur = 0
  let str = ''
  while (cur <= index) {
    cur += 1
    str += '-'
  }
  return str
}
const createParseTree = (state, index = 0, parentNode = null, tree = []) => {
  const previous = state.previous.slice().reverse()
  const node = {
    type: state.complete ? 'Symbol' : state.token ? 'Terminal' : 'Intermediate',
    lhs: state.lhs,
    value: state.token !== undefined ? state.token : state.lhs,
    /* rule: `${state.lhs} : ${state.left
      .map(p => (p instanceof RegExp ? p.toString().slice(1, -1) : p))
      .join(' ')}`, */
    // Not all states should have actions, only completed rules
    action: state.complete ? state.action : null
  }
  if (node.type !== 'Terminal') {
    node.children = []
  }
  if (!parentNode) {
    tree.push(node)
  } else {
    parentNode.children.unshift(node)
  }
  parentNode = node.type === 'Symbol' ? node : parentNode
  previous.forEach(prev => createParseTree(prev, index + 1, parentNode, tree))
  /* console.log(
      `${index} |${createIndent(index)}${prev.lhs} -> ${prev.left.join(
        ' '
      )} . ${prev.right.join(' ')} ${prev.token !== undefined ? prev.token : ''}`
    ) */
  return tree
}
// Le useless
const mapNode = node => {
  const action = node ? node.action : null
  if (action && typeof action === 'function') {
    if (node.children) {
      node = action([node.lhs].concat(node.children))
    } else {
      node = action([node.lhs, node.value])
    }
    if (node === null) {
      return []
    }
    // Ugly .type hack
    // Well this also uses the lhs ...
    const type =
      node && node.length > 1 && typeof node[0] === 'string' ? node.splice(0, 1)[0] : null
    node = node
      ? node.map(child => {
          let n
          if (Array.isArray(child)) {
            n = child.map(child => child).map(child => mapNode(child))
          } else if (child !== undefined && child.type) {
            n = mapNode(child)
          } else if (child !== undefined) {
            n = [child]
          } else {
            n = child
          }
          if (n !== undefined && type) {
            n.type = type
          }
          return n
        })
      : node
    return Array.isArray(node) && !node.type
      ? flattenList(node.filter(node => node))
      : node
  } else {
    return node
  }
}
const createAST = (parseTree, ast = []) => {
  parseTree.forEach(node => ast.unshift(mapNode(node)))
  return ast
}
class Parser {
  constructor(lexer) {
    const self = this
    const compare = (value, right) => {
      if (typeof right === 'object') {
        return right.test(value)
      } else {
        return right === value
      }
    }
    const predict = (chart, grammer, right, index) => {
      for (const rule of grammer) {
        const rhss = rule.rhs
        if (right.length && right[0] === rule.lhs) {
          return rhss.some(rhs => {
            return addToChart(
              chart,
              index,
              new State(
                {
                  lhs: rule.lhs,
                  left: [],
                  right: rhs,
                  dot: 0,
                  from: index,
                  action: rule.action
                },
                rule
              )
            )
          })
        }
      }
    }
    const scan = (chart, token, state, index) => {
      if (state.right.length) {
        let right = state.right[0]
        const value = right === token.type ? token.type : token.value
        right =
          typeof right === 'object' || right === token.type
            ? right
            : right.indexOf('"') === 0
            ? right.slice(1, -1)
            : right
        if (compare(value, right)) {
          const newState = new State({
            lhs: state.lhs,
            left: state.left.concat(state.right[0]),
            dot: state.dot + 1,
            right: state.right.slice(1),
            from: state.from,
            action: state.action
          })
          let changes = addToChart(chart, index + 1, newState)
          if (changes) {
            newState.previous = [state]
            state.token = token.value
          }
          return changes
        } else {
          return false
        }
      } else {
        return false
      }
    }
    const complete = (chart, state, index) => {
      const fromStates = chart[state.from]
      return fromStates.some(fromState => {
        if (
          !state.right.length &&
          fromState.right.length &&
          fromState.right[0] === state.lhs
        ) {
          const newState = new State({
            lhs: fromState.lhs,
            left: fromState.left.concat(fromState.right[0]),
            right: fromState.right.slice(1) || [],
            dot: fromState.dot + 1,
            from: fromState.from,
            action: fromState.action
          })
          let changes = addToChart(chart, index, newState)
          if (changes) {
            newState.previous = fromState.previous.concat(state)
          }
          return changes
        }
      })
    }
    const inStateSet = (stateSet, state) => {
      let inSet = false
      for (const s of stateSet) {
        if (
          s.lhs === state.lhs &&
          s.right.join(' ') === state.right.join(' ') &&
          s.left.join(' ') === state.left.join(' ') &&
          s.from === state.from
        ) {
          inSet = true
          break
        }
      }
      return inSet
    }
    const addToChart = (chart, index, state) => {
      let stateSet = []
      // If there is no column, add one
      if (chart[index]) {
        stateSet = chart[index]
      } else {
        chart[index] = stateSet
      }
      const inSet = inStateSet(stateSet, state)
      if (!inSet) {
        stateSet.push(state)
      }
      return !inSet
    }
    const resumeParse = self => {
      const { grammer, chart, predict, scan, complete } = _private.get(self)
      const start_rule = grammer[0]
      const rhss = start_rule.rhs
      const lexer = self.lexer
      let prevToken = null
      let token = null
      let index = self.index
      if (!self.started) {
        let rules = rhss.map(
          rhs =>
            new State({
              lhs: start_rule.lhs,
              left: [],
              right: rhs,
              dot: 0,
              from: 0,
              action: start_rule.action
            })
        )
        chart[0] = rules
      }
      self.started = true
      while (index <= chart.length) {
        prevToken = token || prevToken
        token = lexer.readToken()
        let changes = true
        while (changes && chart[index]) {
          changes = false
          for (const state of chart[index]) {
            if (state.complete) {
              changes |= complete(chart, state, index)
            } else if (state.expectNonTerminal(grammer)) {
              changes |= predict(chart, grammer, state.right, index)
            } else if (token) {
              changes |= scan(chart, token, state, index)
            }
          }
          if (!changes) {
            break
          }
        }
        index += 1
        self.index = index
      }
      if (token) {
        return self.error({
          prevToken,
          token,
          chart
        })
      } else {
        // Get finished state
        const lastColumn = chart[chart.length - 1]
        let finishedState = null
        for (const state of lastColumn) {
          if (state.complete && state.from === 0 && state.lhs === start_rule.lhs) {
            finishedState = state
            break
          }
        }
        if (!finishedState) {
          return self.error({
            token: null,
            prevToken: null,
            chart
          })
        } else {
          return {
            state: finishedState
          }
        }
      }
    }
    self.started = false
    self.index = 0
    self.lexer = lexer
    _private.set(self, {
      states: [],
      grammer: [],
      chart: [],
      predict,
      scan,
      complete,
      addToChart,
      actions: [],
      resumeParse
    })
  }
  resumeParse() {
    return _private.get(this).resumeParse(this)
  }
  // This is a buggy implementation because it does not take into account multiple trees produced by ambiguitiy
  // Three types of node for the parse tree, there should be four
  // 1. Symbol node i.e. completed grammer rule
  // 2. Intermediate node i.e. completed production rule
  // 3. Terminal node i.e. a leaf
  // 4. Nodes i.e. represent the ambiguitiy - not implemented at the moment
  parse(cb) {
    const self = this
    const { resumeParse } = _private.get(self)
    const state = resumeParse(self)
    if (state.state) {
      self.parseTree = createParseTree(state.state)
      self.AST = createAST(self.parseTree)
      self.index = 0
      self.started = false
      _private.get(self).chart = []
      cb()
    } else {
      self.error(state)
    }
  }
  grammer(list) {
    const self = this
    const charClass = /\[[^\]]+][*|+]?/
    let { grammer } = _private.get(self)
    list.forEach(obj => {
      let lhs = obj.exp.match(/[a-zA-Z]+ :/)
      // The splitting of the rhs does not work correctly when there are regexes with a | in it
      if (lhs) {
        lhs = lhs[0].slice(0, -2)
        const r = obj.exp
          .replace(lhs, '')
          .trim()
          .slice(2)
        if (grammer.every(rule => rule.lhs !== lhs)) {
          grammer.push({
            action: obj.action,
            lhs,
            rhs: r.split(/^\| +| +\| +/g).map(part => {
              return part
                .trim()
                .split(' ')
                .map(p => (charClass.test(p) ? new RegExp(p) : p))
                .filter(p => p)
            })
          })
        }
      } else {
        throw new Error(`Incorrect grammer rule: ${obj.exp}`)
      }
    })
  }
  logChart(completed = false) {
    const { chart } = _private.get(this)
    chart.forEach((stateSet, i) => {
      console.log(`==== ${i} ====`)
      stateSet.forEach(state => {
        if (!completed || (completed && state.complete)) {
          console.log(
            `${state.lhs} -> ${state.left.join(' ')} • ${state.right.join(
              ' '
            )} \t\t from (${state.from})`
          )
        }
      })
    })
  }
  printChart(target = document.body, completed = false) {
    const { chart } = _private.get(this)
    const table = createNewElement('div', ['class=table'])
    const tableHeader = createNewElement('div', ['class=table-header flex'])
    const tableBody = createNewElement('div', ['class=body flex'])
    const docFrag = createNewElement('documentFragment')
    chart.forEach((stateSet, i) => {
      append(tableHeader, createNewElement('div', ['class=header', `content=${i}`]))
      const col = createNewElement('div', ['class=col'])
      append(tableBody, col)
      stateSet.forEach(state => {
        const row = createNewElement('div', ['class=row'])
        append(col, row)
        if (!completed || (completed && state.complete)) {
          row.innerHTML = `${state.lhs} → ${state.left.join(
            ' '
          )} <span class='dot'>•</span> ${state.right.join(' ')} \t\t from (${
            state.from
          })`
        }
      })
    })
    append(target, append(docFrag, append(table, tableHeader, tableBody)))
  }
  printParseTree(target = document.body) {
    const self = this
    const parseTree = self.parseTree
    const docFrag = createNewElement('documentFragment')
    const root = createNewElement('div', ['class=tree flex hcenter'])
    const createTree = tree => {
      const docFrag = createNewElement('documentFragment')
      tree.forEach(node => {
        const el = createNewElement('div', [
          'class=node flex flexcolumn',
          `innerHTML=<span class='name'>${node.value}</span>`
        ])
        append(docFrag, el)
        if (node.children) {
          append(
            el,
            append(
              createNewElement('div', ['class=children flex']),
              createTree(node.children)
            )
          )
        }
      })
      return docFrag
    }
    append(target, append(docFrag, append(root, createTree(parseTree))))
  }
  printAST(target = document.body) {
    const self = this
    const AST = self.AST
    const root = createNewElement('div', ['class=tree ast flex hcenter'])
    const docFrag = createNewElement('documentFragment')
    const createTree = tree => {
      const docFrag = createNewElement('documentFragment')
      tree.forEach(node => {
        const isList =
          Array.isArray(node) &&
          (node.length > 1 || (node.length === 1 && typeof node[0] === 'object'))
        const el = createNewElement('div', ['class=node flex flexcolumn'])
        const value = isList
          ? node.type
          : node
          ? node.type === 'undefined'
            ? 'undefined'
            : node[0] || node
          : node
        if (value) {
          append(el, createNewElement('span', ['class=name', `content=${value}`]))
        }
        append(docFrag, el)
        if (isList) {
          append(
            el,
            append(createNewElement('div', ['class=children flex']), createTree(node))
          )
        }
      })
      return docFrag
    }
    append(target, append(docFrag, append(root, createTree(AST))))
  }
}
export default Parser
