import { createNewElement, append } from '../helpers/U'
import flattenList from './flattenList'
import State from './State'
import { TOKENS } from 'early-parser/lib/parser/'

// Still have to implement nullable grammer rules
const _private = new WeakMap()

const createParseTree = (
  { token, complete, lhs, action, previous },
  index = 0,
  parentNode = null,
  tree = []
) => {
  const { SYMBOL, TERMINAL, INTERMEDIATE } = TOKENS
  const type = complete ? SYMBOL : token ? TERMINAL : INTERMEDIATE
  const node = {
    type,
    lhs,
    value: token !== undefined ? token : lhs,
    // Not all states should have actions, only completed rules
    action: complete ? action : null,
  }

  if (type !== TERMINAL) {
    node.children = []
  }

  if (!parentNode) {
    tree.push(node)
  } else {
    parentNode.children.unshift(node)
  }

  parentNode = type === SYMBOL ? node : parentNode

  let i = previous.length

  while (i) {
    createParseTree(previous[i - 1], index + 1, parentNode, tree)

    i--
  }
  return tree
}

const map = node => {
  node = Array.isArray(node) ? node : [node]

  // Get type returned from the semantic action
  const type =
    node.length > 1 && typeof node[0] === 'string' ? node.splice(0, 1)[0] : null

  return node.map(child => {
    if (Array.isArray(child)) {
      child = child.map(mapNode)
    } else if (child !== undefined && child.type) {
      child = mapNode(child)
    } else if (child !== undefined) {
      child = [child]
    }

    if (child !== undefined && type) {
      child.type = type
    }

    return child
  })
}

const mapNode = node => {
  const action = node.action

  // Perform sematic action on node
  if (action && typeof action === 'function') {
    let list

    if (node.children) {
      list = action([node.type].concat(node.children))
    } else {
      list = action([node.type, node.value])
    }

    if (list === null) {
      return []
    }

    list = map(list)

    return Array.isArray(list) && !list.type ? flattenList(list, true) : list
  } else {
    return [node.value]
  }
}
const createAST = parseTree => parseTree.map(node => mapNode(node))

const compare = (value, right) => {
  if (typeof right === 'object') {
    return right.test(value)
  }

  return right === value
}
const predict = (chart, grammer, right, from) => {
  const rule = grammer.find(({ lhs }) => right.length && right[0] === lhs)

  if (rule) {
    const { action, rhs, lhs } = rule

    return rhs.some(right =>
      addToChart(
        chart,
        from,
        new State(
          {
            lhs,
            left: [],
            right,
            dot: 0,
            from,
            action,
          },
          rule
        )
      )
    )
  }

  return false
}
const scan = (chart, { type, value: tokenValue }, state, index) => {
  if (state.right.length) {
    const rhs = state.right[0]
    const value = rhs === type ? type : tokenValue
    const right =
      typeof rhs === 'object' || rhs === type
        ? rhs
        : rhs.indexOf('"') === 0
        ? rhs.slice(1, -1)
        : rhs

    if (compare(value, right)) {
      const newState = new State({
        lhs: state.lhs,
        left: [...state.left, rhs],
        dot: state.dot + 1,
        right: state.right.slice(1),
        from: state.from,
        action: state.action,
      })
      const changes = addToChart(chart, index + 1, newState)

      if (changes) {
        newState.previous = [state]
        state.token = tokenValue
      }

      return changes
    }

    return false
  } else {
    return false
  }
}
const complete = (chart, state, index) =>
  chart[state.from].some(fromState => {
    const { right, left, dot, lhs, from, action } = fromState

    if (!state.right.length && right.length && right[0] === state.lhs) {
      const newState = new State({
        lhs,
        left: [...left, right[0]],
        right: right.slice(1) || [],
        dot: dot + 1,
        from,
        action,
      })

      const changes = addToChart(chart, index, newState)

      if (changes) {
        newState.previous = [...fromState.previous, state]
      }

      return changes
    }

    return false
  })
const inStateSet = (stateSet, state) =>
  stateSet.some(
    ({ lhs, right, left, from }) =>
      lhs === state.lhs &&
      right.join(' ') === state.right.join(' ') &&
      left.join(' ') === state.left.join(' ') &&
      from === state.from
  )
const addToChart = (chart, index, state) => {
  let stateSet = chart[index]

  if (!stateSet) {
    stateSet = []

    chart[index] = stateSet
  }

  const inSet = inStateSet(stateSet, state)

  if (!inSet) {
    stateSet.push(state)
  }

  return !inSet
}
const getFinishedState = (chart, start_rule) =>
  chart[chart.length - 1].find(
    state => state.complete && state.from === 0 && state.lhs === start_rule.lhs
  )

class Parser {
  constructor(lexer) {
    this.started = false
    this.index = 0
    this.lexer = lexer
    this.chart = []

    _private.set(this, {
      grammer: [],
      actions: [],
      cache: {},
    })
  }

  resumeParse() {
    const self = this
    const { grammer } = _private.get(self)
    const chart = self.chart
    const start_rule = grammer[0]
    const rhss = start_rule.rhs
    const lexer = self.lexer
    let prevToken = null
    let token = null
    let index = self.index

    if (!self.started) {
      chart[0] = rhss.map(
        rhs =>
          new State({
            lhs: start_rule.lhs,
            left: [],
            right: rhs,
            dot: 0,
            from: 0,
            action: start_rule.action,
          })
      )
    }

    self.started = true

    while (index <= chart.length) {
      prevToken = token || prevToken
      token = lexer.readToken()

      let changes = 1

      while (changes && chart[index]) {
        changes = 0

        const states = chart[index]

        for (const state of states) {
          if (!token) {
            if (state.complete) {
              changes |= complete(chart, state, index)
            }
          } else {
            if (state.complete) {
              changes |= complete(chart, state, index)
            } else if (state.expectNonTerminal(grammer)) {
              changes |= predict(chart, grammer, state.right, index)
            } else {
              changes |= scan(chart, token, state, index)
            }
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
        chart,
      })
    }

    const finishedState = getFinishedState(chart, start_rule)

    if (finishedState) {
      return {
        state: finishedState,
      }
    }

    return self.error({
      token: null,
      prevToken: null,
      chart,
    })
  }

  // This is a buggy implementation because it does not take into account multiple trees produced by ambiguitiy
  // Three types of node for the parse tree, there should be four
  // 1. Symbol node i.e. completed grammer rule
  // 2. Intermediate node i.e. completed production rule
  // 3. Terminal node i.e. a leaf
  // 4. Nodes i.e. represent the ambiguitiy - not implemented at the moment

  parse(cb) {
    const self = this
    const cache = _private.get(self).cache[self.lexer.source]

    if (cache) {
      self.parseTree = cache.parseTree
      self.AST = cache.AST

      return cb()
    }

    const state = self.resumeParse()

    if (state.state) {
      self.parseTree = createParseTree(state.state)
      self.AST = createAST(self.parseTree)
      self.index = 0
      self.started = false

      self.chart = []

      _private.get(self).cache[self.lexer.source] = {
        AST: self.AST,
        parseTree: self.parseTree,
      }

      self.lexer.reset()

      return cb()
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

        const r = obj.exp.replace(lhs, '').trim().slice(2)

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
            }),
          })
        }
      } else {
        throw new Error(`Incorrect grammer rule: ${obj.exp}`)
      }
    })
  }
  // logChart(completed = false) {
  //   const { chart } = _private.get(this)

  //   chart.forEach((stateSet, i) => {
  //     console.log(`==== ${i} ====`)

  //     stateSet.forEach(state => {
  //       if (!completed || (completed && state.complete)) {
  //         console.log(
  //           `${state.lhs} -> ${state.left.join(' ')} • ${state.right.join(
  //             ' '
  //           )} \t\t from (${state.from})`
  //         )
  //       }
  //     })
  //   })
  // }

  // printChart(target = document.body, completed = false) {
  //   const { chart } = _private.get(this)
  //   const table = createNewElement('div', ['class=table'])
  //   const tableHeader = createNewElement('div', ['class=table-header flex'])
  //   const tableBody = createNewElement('div', ['class=body flex'])
  //   const docFrag = createNewElement('documentFragment')

  //   // console.log(this.lexer.source)

  //   chart.forEach((stateSet, i) => {
  //     append(tableHeader, createNewElement('div', ['class=header', `content=${i}`]))

  //     const col = createNewElement('div', ['class=col'])

  //     append(tableBody, col)

  //     stateSet.forEach(state => {
  //       const row = createNewElement('div', ['class=row'])
  //       append(col, row)

  //       if (!completed || (completed && state.complete)) {
  //         row.innerHTML = `${state.lhs} → ${state.left.join(
  //           ' '
  //         )} <span class='dot'>•</span> ${state.right.join(' ')} \t\t from (${
  //           state.from
  //         })`
  //       }
  //     })
  //   })

  //   append(target, append(docFrag, append(table, tableHeader, tableBody)))
  // }

  // printParseTree(target = document.body) {
  //   const self = this
  //   const parseTree = self.parseTree
  //   const docFrag = createNewElement('documentFragment')
  //   const root = createNewElement('div', ['class=tree flex hcenter'])
  //   const createTree = tree => {
  //     const docFrag = createNewElement('documentFragment')
  //     tree.forEach(node => {
  //       const el = createNewElement('div', [
  //         'class=node flex flexcolumn',
  //         `innerHTML=<span class='name'>${node.value}</span>`,
  //       ])
  //       append(docFrag, el)
  //       if (node.children) {
  //         append(
  //           el,
  //           append(
  //             createNewElement('div', ['class=children flex']),
  //             createTree(node.children)
  //           )
  //         )
  //       }
  //     })
  //     return docFrag
  //   }
  //   append(target, append(docFrag, append(root, createTree(parseTree))))
  // }

  // printAST(target = document.body) {
  //   const self = this
  //   const AST = self.AST
  //   const root = createNewElement('div', ['class=tree ast flex hcenter'])
  //   const docFrag = createNewElement('documentFragment')
  //   const createTree = tree => {
  //     const docFrag = createNewElement('documentFragment')
  //     tree.forEach(node => {
  //       const isList =
  //         Array.isArray(node) &&
  //         (node.length > 1 || (node.length === 1 && typeof node[0] === 'object'))
  //       const el = createNewElement('div', ['class=node flex flexcolumn'])
  //       const value = isList
  //         ? node.type
  //         : node
  //         ? node.type === 'undefined'
  //           ? 'undefined'
  //           : node[0] || node
  //         : node
  //       if (value) {
  //         append(el, createNewElement('span', ['class=name', `content=${value}`]))
  //       }
  //       append(docFrag, el)
  //       if (isList) {
  //         append(
  //           el,
  //           append(createNewElement('div', ['class=children flex']), createTree(node))
  //         )
  //       }
  //     })
  //     return docFrag
  //   }
  //   append(target, append(docFrag, append(root, createTree(AST))))
  // }
}

export default Parser
