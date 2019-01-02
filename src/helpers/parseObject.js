export const parseObject = value => {
  let ident = /^[a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*/
  let operators = /[+\-*\/]/
  const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
  }
  let str = /(?:"|')[^"']*(?:"|')/
  let obj = {}
  value
    .replace(/^{|}$/g, '')
    .trim()
    .split(',')
    .forEach(line => {
      line = line.split(/\s*:\s*/)
      let left = null
      let key = line[0]
      let operator = null
      let val = line[1].split(/\s+/).reduce((acc, cur, i, arr) => {
        let out = ''
        if (ident.test(cur)) {
          let placeholder = cur
          let value = getValue(vm.data, {
            placeholder,
            identifiers: mapToKeys(placeholder).keys
          })
          out = value.value
        } else if (str.test(cur)) {
          out = cur.replace(/^(?:"|')|(?:"|')$/g, '')
        }
        if (operators.test(arr[i + 1])) {
          left = out
          out = ''
        }
        if (operator && left) {
          out = operations[operator](left, out)
          left = null
          operator = null
        }
        if (operators.test(cur)) {
          operator = cur
        }
        return acc + out
      }, '')
      obj[key] = val
    })
  return obj
}
