const mapFieldList = (arr, chunk = 2) => {
  const list = []
  while (arr.length) {
    list.push(arr.splice(0, chunk))
  }
  return list
}

export default mapFieldList
