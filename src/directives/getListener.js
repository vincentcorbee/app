const getListener = (name, vm) => {
  const orgVm = vm

  while (vm !== null) {
    const listener = vm[name]

    if (!vm.isDestroyed && listener) {
      return {
        vm,
        listener,
      }
    }

    vm = vm.$parent
  }

  return {
    vm: orgVm,
    listener: null,
  }
}

export default getListener
