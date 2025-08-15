export const hyphenToPascal = (str: string) =>
  str
    .replace(/-[A-z]/g, match => `${match[1].toUpperCase()}`)
    .replace(/^[a-z]/, match => match.toUpperCase())
