export function getRouterView(root: any) {
  let routerView: any = null

  function traverse(node: any) {
    if (routerView) return

    const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
      acceptNode: () => {
        return NodeFilter.FILTER_ACCEPT
      },
    })

    let currentNode

    while (!routerView && (currentNode = treeWalker.nextNode()) !== null) {
      if ((currentNode as Node & { $name: string }).$name === 'router-view') {
        routerView = currentNode

        break
      }

      if ((currentNode as Element).shadowRoot) {
        traverse((currentNode as Element).shadowRoot)
      }
    }
  }

  traverse(root)

  return routerView
}
