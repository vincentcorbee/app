const grammer = [
  {
    exp: 'Prog : TopStmts',
    action: list => ['program', list[1]]
  },
  {
    exp: 'TopStmts : | TopStmtsPref',
    action: list => [list[1]]
  },
  {
    exp: 'TopStmtsPref : TopStmt',
    action: list => [list[1]]
  },
  {
    exp: 'TopStmt : Stm',
    action: list => [list[1]]
  },
  {
    exp: 'Stm : EmpStm | ExpStm OptSemi',
    action: list => [list[1]]
  },
  {
    exp: 'EmpStm : SEMI',
    action: () => null
  },
  {
    exp: 'ExpStm : Exp',
    action: list => [list[1]]
  },
  {
    exp: 'OptSemi : SEMI',
    action: () => null
  },
  {
    exp: 'Exp : AsExp | Exp COMMA AsExp',
    action: list => (list.length === 4 ? [[list[1], list[3]]] : [list[1]])
  },
  {
    exp: 'AsExp : ConExp | LsExp EQUAL AsExp | LsExp CompAs AsExp',
    action: list => {
      if (list.length === 4) {
        return [
          'assign',
          [list[1], list[2].value === '=' ? list[2].value : list[2], list[3]]
        ]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp:
      'CompAs : "*=" | "/=" | "%=" | "+=" | "-=" | "<<=" | ">>=" | ">>>=" | "&=" | "^=" | "|="',
    action: list => [list[1].value]
  },
  {
    exp: 'ConExp : LogOrExp | LogOrExp TENARY AsExp PERIOD AsExp',
    action: list => {
      if (list.length === 6) {
        return ['tenary', [list[1], list[3], list[5]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'LogOrExp :  LogAndExp | LogOrExp OR LogAndExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'LogAndExp :  BitOrExp | LogAndExp AND BitOrExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'BitOrExp :  BitXorExp | BitOrExp BINOR BitXorExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'BitXorExp :  BitAndExp | BitXorExp XOR BitAndExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'BitAndExp :  EqExp | BitAndExp BINAND EqExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp:
      'EqExp :  RelExp | EqExp EQUALEQUAL RelExp | EqExp NOTEQUAL RelExp | EqExp STRICTEQUAL RelExp | EqExp NOTSTRICTEQUAL RelExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp:
      'RelExp :  ShiExp | RelExp LT ShiExp | RelExp GT ShiExp | RelExp LTEQ ShiExp | RelExp GTEQ ShiExp',
    action: list => {
      if (list.length === 4) {
        return ['binop', [list[1], list[2].value, list[3]]]
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp:
      'ShiExp :  AddExp | ShiExp "<<" AddExp | ShiExp ">>" AddExp | ShiExp ">>>" AddExp',
    action: list =>
      list.length === 4 ? ['binop', [list[1], list[2].value, list[3]]] : [list[1]]
  },
  {
    exp: 'AddExp : MulExp | AddExp PLUS MulExp | AddExp MINUS MulExp',
    action: list =>
      list.length === 4 ? ['binop', [list[1], list[2].value, list[3]]] : [list[1]]
  },
  {
    exp: 'MulExp : UnExp | MulExp MULTIPLY UnExp | MulExp MODULUS UnExp',
    action: list =>
      list.length === 4 ? ['binop', [list[1], list[2].value, list[3]]] : [list[1]]
  },
  {
    exp: 'UnExp : PfixExp | PLUS UnExp | MINUNS UnExp',
    action: list => (list.length === 3 ? ['unop', [list[1], list[2]]] : [list[1]])
  },
  {
    exp: 'PfixExp : LsExp | LsExp PLUSPLUS | LsExp MINMIN',
    action: list => [list[1]]
  },
  {
    exp: 'LsExp : CallExp',
    action: list => [list[1]]
  },
  {
    exp: 'CallExp : PriExp | CallExp Args | CallExp MemOp',
    action: list => {
      if (list.length === 3) {
        if (list[2].value === 'MemOp') {
          return ['accessor', [list[1], list[2]]]
        } else {
          return ['call', [list[1], list[2]]]
        }
      } else {
        return [list[1]]
      }
    }
  },
  {
    exp: 'MemOp : LBRACK Exp RBRACK | DOT Identifier',
    action: list => [list[2]]
  },
  {
    exp: 'Args : LPAREN RPAREN | LPAREN ArgList RPAREN',
    action: list => (list.length === '3' ? ['args', []] : ['args', [list[2]]])
  },
  {
    exp: 'ArgList : AsExp | ArgList COMMA AsExp',
    action: list => (list.length === 4 ? [[list[1], list[3]]] : [[list[1]]])
  },
  {
    exp: 'PriExp : SimExp | ObjLit',
    action: list => [list[1]]
  },
  {
    exp: 'ObjLit : LCBRACE RCBRACE | LCBRACE FieldList RCBRACE',
    action: list =>
      list.length === 4 ? ['objectLiteral', [list[2]]] : ['objectLiteral', []]
  },
  {
    exp: 'FieldList : LitField | FieldList COMMA LitField',
    action: list => (list.length === 4 ? [[list[1], list[3]]] : [list[1]])
  },
  {
    exp: 'LitField : Identifier PERIOD AsExp',
    action: list => [[list[1], list[3]]]
  },
  {
    exp:
      'SimExp : This | Null | Boolean | String | Number | Identifier | ParenExp | ArrLit',
    action: list => [list[1]]
  },
  {
    exp: 'ParenExp : LPAREN Exp RPAREN',
    action: list => [list[2]]
  },
  {
    exp: 'ArrLit : LBRACK RBRACK | LBRACK ElmList RBRACK',
    action: list =>
      list.length === 4 ? ['arrayLiteral', [list[2]]] : ['arrayLiteral', []]
  },
  {
    exp: 'ElmList : LitElm | ElmList COMMA LitElm',
    action: list => (list.length === 4 ? [list[1], list[3]] : [list[1]])
  },
  {
    exp: 'LitElm : AsExp',
    action: list => [list[1]]
  },
  {
    exp: 'Identifier : IDENTIFIER',
    action: list => [
      list[1].value === 'undefined' ? 'undefined' : 'identifier',
      list[1].value
    ]
  },
  {
    exp: 'Number : NUMBER',
    action: list => ['number', list[1].value]
  },
  {
    exp: 'String : STRING',
    action: list => ['string', list[1].value]
  },
  {
    exp: 'Null : NULL',
    action: list => ['null', list[1].value]
  },
  {
    exp: 'This : THIS',
    action: list => ['this', list[1].value]
  },
  {
    exp: 'Boolean : TRUE | FALSE',
    action: list => ['boolean', list[1].value]
  }
]
export default grammer
