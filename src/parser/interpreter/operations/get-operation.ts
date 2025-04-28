import { binaryOperations, assignOperations, unaryOperations } from './operations'

const getOperation = (op: string, type: 'binary' | 'assign' | 'unary') => {
  switch (type) {
    case 'binary':
      return binaryOperations[op as keyof typeof binaryOperations]
    case 'assign':
      return assignOperations[op as keyof typeof assignOperations]
    case 'unary':
      return unaryOperations[op as keyof typeof unaryOperations]
    default:
      throw new Error(`Unknown operation type: ${type}`)
  }
}

export default getOperation
