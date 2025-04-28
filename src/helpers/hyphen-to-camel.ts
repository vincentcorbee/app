export const hyphenToCamel = (str: string) =>
  str.replace(/-[A-z]/g, match => `${match[1].toUpperCase()}`)
