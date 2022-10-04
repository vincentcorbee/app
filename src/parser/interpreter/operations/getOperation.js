import { binaryOperations, assignOperations, unaryOperations } from './operations'

const getOperation = (op, type) => {
  switch (type) {
    case 'binary':
      return binaryOperations[op]
    case 'assign':
      return assignOperations[op]
    case 'unary':
      return unaryOperations[op]
  }
}

export default getOperation
