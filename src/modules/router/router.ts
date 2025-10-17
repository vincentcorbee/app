import { RouterInterface } from '../../types'
import Emitter from '../emitter'
import { getRouterView } from './helpers/get-router-view'

const _private = new WeakMap()

export class Router extends Emitter implements RouterInterface {
  #activeAnimations: boolean

  constructor({ baseUrl = '' } = {}) {
    super()

    this.#activeAnimations = false

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

    document.addEventListener(
      'rippleanimationend',
      () => (this.#activeAnimations = false)
    )

    document.addEventListener(
      'rippleanimationstart',
      () => (this.#activeAnimations = true)
    )
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

  set(...args: any[]) {
    args.forEach(route => _private.get(this).routes.push(this.#createRoute(route)))
  }

  registerRouterLink(routerLink: any) {
    const { routerLinks } = _private.get(this)

    routerLinks.add(routerLink)

    routerLink.on('beforeDestroy', () => {
      this.unRegisterRouterLink(routerLink)
    })

    this.#updateRouterLink(routerLink)
  }

  unRegisterRouterLink(routerLink: any) {
    const { routerLinks } = _private.get(this)

    routerLinks.delete(routerLink)
  }

  navigate(path: string) {
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

  addRoute(route: any) {
    if (typeof route !== 'object') throw TypeError(route + ' is not a object')

    _private.get(this).routes.push(this.#createRoute(route))

    this.updateRouterViews()

    return this
  }

  async updateRouterViews() {
    const { routes, currentPathSegments, currentFullPath } = _private.get(this)
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
      const { matched } = result

      _private.get(this).currentRoute = result

      let currentRouterView

      title = this.#updateRouterLinks()

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

    const url = currentFullPath

    window.history.pushState(
      {
        url,
        title,
      },
      title,
      url
    )
  }

  next(arg: unknown) {
    if (arg === 'string') this.navigate(arg)
    else if (arg instanceof Error) this.#handleError(arg)
    else if (arg === undefined) _private.get(this).dispatch(this)
    else if (arg === false) return
  }

  #init() {
    const state = window.history.state || {
      url: this.baseUrl || '/',
      title: '',
    }

    // @ts-ignore
    window.history.replaceState(state, null, '')

    window.addEventListener('popstate', e => this.navigate(e.state.url))
  }

  #createRoute(config: any) {
    const { path, component, children, redirect } = config

    return {
      path: `/${path}`.replace(/\/\//g, '/'),
      component,
      children: children ? children.map((child: any) => this.#createRoute(child)) : [],
      redirect,
    }
  }

  async #updateRouterView(routerView: any, node: any) {
    const self = this

    return new Promise<undefined>(resolve => {
      let pending = false

      function startTransition() {
        if (document.visibilityState === 'visible') {
          if (!self.#activeAnimations) {
            /* Disabled it because of issues on mobile */
            // document.startViewTransition(() => {
            routerView.innerHTML = ''

            routerView.appendChild(node)

            resolve(undefined)
            // })

            if (pending) document.removeEventListener('visibilitychange', startTransition)
          } else {
            requestIdleCallback(startTransition)
          }
        } else {
          pending = true

          document.addEventListener('visibilitychange', startTransition)
        }
      }

      startTransition()
    })
  }

  #updateRouterLink(routerLink: any): string {
    const { currentRoute } = _private.get(this)

    let title = ''

    if (!currentRoute) return title

    const { $node } = routerLink
    const to = $node.getAttribute('to')
    const active = $node.getAttribute('active') === 'true'

    if ((to?.replace(/$\//, '') || '/') === currentRoute.fullPath) {
      if (!active) $node.setAttribute('active', true)

      title = $node.textContent ?? ''
    } else if (active) $node.setAttribute('active', false)

    return title
  }

  #updateRouterLinks(): string {
    const { routerLinks } = _private.get(this)

    let title = ''

    routerLinks.forEach((routerLink: any) => {
      title = this.#updateRouterLink(routerLink)
    })

    return title
  }

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

            params = childRoute.params as Record<string, string>

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

            params = childRoute.params as Record<string, string>
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

  #getFullPath(source: string, baseUrl = ''): string {
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
    let params: Record<string, string> = {}

    if (!path.includes('?')) return params

    path
      .split('?')
      .pop()
      ?.split(/&/g)
      .forEach(param => {
        if (param) {
          const parts = param.split('=')

          params[parts[0]] = parts[1]
        }
      })

    return params
  }

  async #createComponent(component: any) {
    const { $vm } = this
    const App = Reflect.getPrototypeOf($vm)?.constructor

    if (!App) {
      throw new Error('No App instance found')
    }

    component = Object.assign({}, component)
    component.router = this
    component.parent = $vm

    const node = await (App as any).component(component.name, component)

    return { component, node }
  }

  #handleError(error: any) {
    const { routes } = _private.get(this)
    const route = routes.find((route: any) => route.error)

    if (route) {
      // route.err(false, error)
    } else {
      console.warn(`${error.message}`)
    }

    this.emit('error', {
      type: 'error',
      error,
    })
  }
}
