export function isInteger(char: string): boolean
{
  const code = char.charCodeAt(0)

  return code >= 48 && code <= 57
}