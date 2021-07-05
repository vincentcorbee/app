// class Person {
//   constructor() {
//     this.name = 'Jaap'
//   }
//   sayName() {
//     console.log(this.name)
//   }
// }

// const exponent = (base, exponent) => {
//   let result = 1
//   while (exponent) {
//     result *= base
//     exponent -= 1
//   }
//   return result
// }

// const log2 = num => {
//   for (let exp = 0; exp <= num; exp += 1) {
//     const next = exp + 1
//     if (exponent(2, next) > num) {
//       return exp
//     }
//   }
// }

// const createList = num => {
//   const arr = []
//   while (num) {
//     arr.push(num)
//     num -= 1
//   }
//   return arr
// }

// console.log(log2(1))

const listLength = (list = null, length = 0) => {
  try {
    return list.pop() ? listLength(list, length + 1) : length
  } catch (e) {
    return { err: length }
  }
}
