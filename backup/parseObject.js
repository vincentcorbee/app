export const parseObject = value => {
  const ident = /^[a-zA-Z\-0-9]+(?:\.[a-zA-Z\-0-9]+|\[[a-zA-Z\-0-9]+\])*/
  const operators = /[+\-*\/]/
  const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  }
  const str = /(?:"|')[^"']*(?:"|')/
  const obj = {}

  value
    .replace(/^{|}$/g, '')
    .trim()
    .split(',')
    .forEach(line => {
      line = line.split(/\s*:\s*/)

      let left = null
      let operator = null

      const key = line[0]
      const val = line[1].split(/\s+/).reduce((acc, cur, i, arr) => {
        let out = ''

        if (ident.test(cur)) {
          const placeholder = cur
          const value = getValue(vm.data, {
            placeholder,
            identifiers: mapToKeys(placeholder).keys,
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
