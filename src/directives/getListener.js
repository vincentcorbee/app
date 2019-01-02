const getListener = (name, vm) => {
  while (vm !== null) {
    if (vm[name]) {
      return vm[name]
    }
    vm = vm.parent
  }
}
export default getListener
