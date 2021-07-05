const inheritPrototype = (superType, ...subTypes) =>
  subTypes.forEach(subType => {
    const prototype = Object.create(superType.prototype)

    prototype.constructor = subType
    subType.prototype = prototype
  })

export default inheritPrototype
