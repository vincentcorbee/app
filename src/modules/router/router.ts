//@ts-nocheck
import Emitter from '../emitter'
import { createNewElement } from '../../utils'

const _private = new WeakMap()

function getRouterView(root) {
  let routerView = null

  function traverse(node) {
    if (routerView) return

    const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
      acceptNode: () => {
        return NodeFilter.FILTER_ACCEPT
      },
    })

    let currentNode

    while (!routerView && (currentNode = treeWalker.nextNode()) !== null) {
      if (currentNode.$name === 'router-view') {
        routerView = currentNode

        break
      }

      if (currentNode.shadowRoot) traverse(currentNode.shadowRoot)
    }
  }

  traverse(root)

  return routerView
}

export class Router extends Emitter implements RouterInterface {
  constructor({ baseUrl = '' } = {}) {
    super()

    const currentFullPath = this.#getFullPath(
      `${window.location.pathname}${window.location.search}`,
      baseUrl
    )
    const currentPathSegments = this.#getPathSegments(window.location.pathname, baseUrl)

    _private.set(this, {
      $vm: null,
      routes: [],
      error: false,
      routerLinks: new Set(),
      routerViews: new Map(),
      offset: 0,
      currentPathSegments,
      currentFullPath,
      currentRoute: null,
      baseUrl:
        baseUrl === './'
          ? currentPathSegments.pop()
          : baseUrl === '/'
          ? currentFullPath
          : baseUrl,
    })
  }

  get baseUrl() {
    return _private.get(this).baseUrl
  }

  set baseUrl(path) {
    _private.get(this).baseUrl = path
  }

  get $vm() {
    return _private.get(this).$vm
  }

  get currentRoute() {
    return _private.get(this).currentRoute
  }

  set $vm(vm) {
    _private.get(this).$vm = vm

    this.#init()

    this.updateRouterViews()
  }

  #createRoute(config: any, parent = null) {
    const { path, component, children, redirect } = config

    return {
      path: `/${path}`.replace(/\/\//g, '/'),
      component,
      children: children ? children.map(child => this.#createRoute(child, config)) : [],
      redirect,
    }
  }

  set(...args) {
    args.forEach(route => _private.get(this).routes.push(this.#createRoute(route)))
  }

  registerRouterLink(routerLink: any) {
    const { routerLinks, currentRoute } = _private.get(this)

    routerLinks.add(routerLink)

    this.#updateRouterLink(routerLink)
  }

  unRegisterRouterLink(routerLink: any) {
    const { routerLinks } = _private.get(this)

    routerLinks.delete(routerLink)
  }

  navigate(path) {
    if (_private.get(this).currentFullPath === path) return

    _private.get(this).currentPathSegments = this.#getPathSegments(path, this.baseUrl)
    _private.get(this).currentFullPath = path

    this.updateRouterViews()
  }

  setQueryParams(params = {}) {
    const { getQueryParams, title = '' } = _private.get(this)
    const queryParams = { ...getQueryParams(), ...params }

    let queryString = ''

    for (const param in queryParams) {
      queryString += `${queryString.length ? '&' : ''}${param}=${queryParams[param]}`
    }

    const url = `${window.location.pathname}${
      queryString.length ? `?${queryString}` : ''
    }`

    window.history.pushState(
      {
        url,
        title,
      },
      title,
      url
    )
  }

  addRoute(route) {
    if (typeof route !== 'object') throw TypeError(route + ' is not a object')

    _private.get(this).routes.push(this.#createRoute(route))

    this.updateRouterViews()

    return this
  }

  async #updateRouterView(routerView: any, node: any) {
    return new Promise(resolve => {
      document.startViewTransition(() => {
        routerView.innerHTML = ''

        routerView.appendChild(node)

        resolve()
      })
    })
  }

  async updateRouterViews() {
    const { routes, currentPathSegments, routerLinks, currentFullPath } =
      _private.get(this)
    const { $vm } = this

    _private.get(this).error = false

    const result = this.#matchRoute(currentPathSegments, routes)

    if (!result) return

    const { activeRoute } = result

    if (activeRoute.redirect) {
      this.navigate(activeRoute.redirect)

      return null
    }

    let title = ''
    let currentComponent

    if (result) {
      const { matched, name = 'default' } = result
      const { routerViews } = _private.get(this)
      const views = routerViews.get(name)

      _private.get(this).currentRoute = result

      let currentRouterView

      for (let i = 0; i < matched.length; i++) {
        const currentRoute = matched[i]

        if (currentRoute.component) {
          currentRouterView = getRouterView(currentRouterView ?? $vm.$node)

          // This should reuse components not create a new component every time

          const { component, node } = await this.#createComponent(currentRoute.component)

          await this.#updateRouterView(currentRouterView, node)

          component.instance = node.$vm

          currentRoute.component = component

          currentComponent = component
        }
      }

      title = this.#updateRouterLinks()

      this.emit('navigate', {
        type: 'navigate',
        req: result,
        component: currentComponent,
      })
    } else {
      _private.get(this).error = true
    }

    if (_private.get(this).error) {
      this.#handleError(Error(`${currentFullPath} not found`))
    }

    window.history.pushState(
      {
        url: currentFullPath,
        title,
      },
      title,
      currentFullPath
    )
  }

  next(arg) {
    if (arg === 'string') this.navigate(arg)

    if (arg instanceof Error) handleError(this, arg)

    if (arg === undefined) _private.get(this).dispatch(this)

    if (arg === false) return
  }

  #init() {
    const state = window.history.state || {
      url: '/',
      title: '',
    }

    window.history.replaceState(state, null, '')
    window.addEventListener('popstate', e => this.navigate(e.state.url, false))
  }

  #updateRouterLink(routerLink): string {
    const { currentRoute } = _private.get(this)

    let title = ''

    if (!currentRoute) return title

    const { $node } = routerLink
    const to = $node.getAttribute('to')

    if (to.replace(/$\//, '') || '/' === currentRoute.fullPath) {
      if (!$node.active) $node.setAttribute('active', true)

      title = $node.textContent ?? ''
    } else if ($node.active) $node.removeAttribute('active')

    return title
  }

  #updateRouterLinks(): string {
    const { routerLinks, currentRoute } = _private.get(this)
    let title = ''

    routerLinks.forEach((routerLink, i) => {
      title = this.#updateRouterLink(routerLink)
    })

    return title
  }

  #getRoute = (uri: string, routes: any[]): any | null =>
    routes.find(route => route.uri === uri) || null

  #matchRoute(pathSegments: string[], routes: any[]) {
    const { currentFullPath } = _private.get(this)
    const queryParams = this.#getQueryParams(currentFullPath)
    const path = this.#getPath()
    const { length: lengthPathSegements } = pathSegments

    let params: Record<string, string> = {}
    let matched: any[] = []
    let activeRoute: any | null = null

    for (const route of routes) {
      let match = false

      const { path: routePath } = route
      const parts = this.#getPathSegments(routePath)

      if (parts.length !== lengthPathSegements && !route.children.length) {
        match = false

        continue
      }

      for (let i = 0; i < lengthPathSegements; i++) {
        const part = parts[i]
        const segment = pathSegments[i]

        if (part && (part === segment || /^:/.test(part))) {
          if (/^:/.test(part)) params[part.replace(':', '')] = segment

          match = true
        } else if (part === undefined && route.children.length > 0) {
          const childRoute = this.#matchRoute(
            ['/', ...pathSegments.slice(i)],
            route.children
          )

          if (childRoute) {
            matched.push(route, ...childRoute.matched)

            params = childRoute.params

            match = true
            break
          } else {
            match = false
            break
          }
        } else {
          match = false
          break
        }
      }

      if (match) {
        if (matched.length === 0) matched.push(route)

        /* If only a single match, check to see if children have a root match */
        if (matched.length === 1 && route.children.length > 0) {
          const [route] = matched
          const childRoute = this.#matchRoute(['/'], route.children)

          if (childRoute) {
            matched.push(...childRoute.matched)

            params = childRoute.params
          }
        }

        activeRoute = matched[matched.length - 1]

        return {
          params,
          path,
          fullPath: currentFullPath,
          matched,
          activeRoute,
          queryParams,
        }
      }
    }

    activeRoute = routes.find((route: any) => route.uri === '*')

    if (activeRoute) {
      return {
        params: [],
        path,
        fullPath: currentFullPath,
        matched: [activeRoute],
        activeRoute,
        queryParams,
      }
    }

    return null
  }

  #getFullPath(source: string, baseUrl = ''): string[] {
    const path = source.replace(baseUrl, '')

    return path.length === 0 ? '/' : path[0] !== '/' ? `/${path}` : path
  }

  #getPath() {
    const { currentFullPath } = _private.get(this)

    return currentFullPath.replace(/\?.*$/, '')
  }

  #getPathSegments(source: string, baseUri = ''): string[] {
    const segments = source
      .replace(baseUri, '')
      .replace(/\?.*$/, '')
      .split('/')
      .filter(Boolean)

    return segments.length === 0
      ? ['/']
      : segments[0] !== '/'
      ? ['/', ...segments]
      : segments
  }

  #getQueryParams(path: string): Record<string, string> {
    let params = {}

    if (!path.includes('?')) return params

    path
      .split('?')
      .pop()
      .split(/&/g)
      .forEach(param => {
        if (param) {
          param = param.split('=')
          params[param[0]] = param[1]
        }
      })

    return params
  }

  async #createComponent(component, name) {
    const { $vm } = this
    const App = Reflect.getPrototypeOf($vm).constructor

    component = Object.assign({}, component)
    component.router = this
    component.parent = $vm

    const node = await App.component(component.name, component)

    return { component, node }
  }

  #clearRouterViews(routerViews) {
    routerViews.forEach(routerView => this.#clearRouterView(routerView))
  }

  #clearRouterView(routerView) {
    if (routerView.$node) routerView.$node.innerHTML = ''
  }

  #handleError(error) {
    const { routes } = _private.get(this)
    const route = routes.find(route => route.error)

    if (route) {
      // route.err(false, err)
    } else {
      console.warn(`${error.message}`)
    }

    this.emit('error', {
      type: 'error',
      error,
    })
  }
}
