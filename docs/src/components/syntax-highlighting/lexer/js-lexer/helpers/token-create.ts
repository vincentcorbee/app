import { TokenType } from "../types";

export function tokenCreate(type: TokenType, value: string, error?: string)
{
  return {
    type,
    value,
    error
  }
}