const mapProps = list => {
  const path = []

  const map = list => {
    list.forEach(node => {
      if (node[0].type === 'accessor') {
        mapProps(node[0])
        path.push(node[1][0])
      } else if (node.type === 'accessor') {
        mapProps(node)
      } else {
        path.push(node[0])
      }
    })
  }

  map(list)

  return path
}

export default mapProps
