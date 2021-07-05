const hasKey = (data, key) =>
  data.prop === key && Object.keys(data.target).indexOf(key) > -1

export default hasKey
