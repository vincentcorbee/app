const getIdentifiersFromObject = value => {
  let ident = /^[a-z\-0-9]+(?:\.[a-z\-0-9]+|\[[a-z\-0-9]+\])*/
  let identifiers = []
  value
    .replace(/^{|}$/g, '')
    .trim()
    .split(',')
    .forEach(line => {
      line = line.split(/\s*:\s*/)
      line[1].split(/\s+/).forEach(cur => {
        if (ident.test(cur)) {
          identifiers.push(cur)
        }
      })
    })
  return identifiers
}
