export default [
  {
    type: 'BEGINCOMMENT',
    reg: /^\/\*/,
    begin: 'COMMENT'
  },
  {
    type: 'NEWLINE',
    reg: /^[\n\r]/,
    cb: lex => {
      lex.line += 1
      lex.col = 0
      // If set to true newlines are tokenized and user for automated semicolon insertion
      return true
    }
  },
  ['SEMI', /^;/],
  ['THIS', /^this/],
  {
    type: 'NULL',
    reg: /^null/,
    value: v => null
  },
  ['FALSE', /^false/],
  ['TRUE', /^true/],
  {
    type: 'NUMBER',
    reg: /^[0-9]+(?:\.?[0-9]+)*/,
    value: num => parseFloat(num)
  },
  {
    type: 'STRING',
    reg: /^(?:"(?:[^"\\]|(?:\\.))*")|'(?:[^'\\]|(?:\\.))*'/,
    value: str => str.slice(1, -1)
  },
  ['COMMA', /^,/],
  ['DOT', /^\./],
  ['PERIOD', /^\:/],
  ['IN', /^in\b/],
  ['OF', /^of\b/],
  ['TYPEOF', /^typeof\b/],
  ['PLUSIS', /^\+=\b/],
  ['MULTIPLY', /^\*/],
  ['DIVIDE', /^\//],
  ['INCREMENT', /^\++\b/],
  ['MODULUS', /^\%/],
  ['PLUS', /^\+/],
  ['DECREMENT', /^\-\-\b/],
  ['MINUS', /^\-/],
  ['LOGNOT', /^\!/],
  ['TENARY', /^\?/],
  ['NOTEQUAL', /^\!=/],
  ['NOTSTRICTEQUAL', /^\!==\b/],
  ['STRICTEQUAL', /^===\b/],
  ['EQUALEQUAL', /^==\b/],
  ['EQUAL', /^=/],
  ['LT', /^</],
  ['LTEQ', /^<=/],
  ['GT', /^>/],
  ['GTEQ', /^>=/],
  ['LOGOR', /^\|\|/],
  ['XLOGOR', /^\^/],
  ['LOGAND', /^&&{2}/],
  ['OR', /^\|/],
  ['NOT', /^~/],
  ['AND', /^&{1}/],
  ['LPAREN', /^\(/],
  ['RPAREN', /^\)/],
  ['LCBRACE', /^\{/],
  ['RCBRACE', /^\}/],
  ['LBRACK', /^\[/],
  ['RBRACK', /^\]/],
  ['IDENTIFIER', /^[$a-zA-Z]+(?:[a-zA-Z_\-]+)*/]
]
