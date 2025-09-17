export function isAsciiAz(char: string): boolean
{
  const code = char.charCodeAt(0)

  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}