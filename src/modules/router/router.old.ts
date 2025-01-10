//@ts-nocheck
import Emitter from '../emitter'
import { createNewElement } from '../../utils'

const _private = new WeakMap()

export class Router extends Emitter implements RouterInterface {
  constructor({ baseUrl = '' } = {}) {
    super()

    const currentUri = this.#getCurrentUri(window.location.pathname, baseUrl)

    _private.set(this, {
      $vm: null,
      currentUri,
      routes: [],
      error: false,
      routerLinks: new Set(),
      routerViews: new Map(),
      offset: 0,
      currentUrl: '',
      baseUrl:
        baseUrl === './'
          ? currentUri.pop()
          : baseUrl === '/'
          ? currentUri.join('/')
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

  set $vm(vm) {
    _private.get(this).$vm = vm

    this.#init()

    this.dispatch()
  }

  set(...args) {
    args.forEach(route => _private.get(this).routes.push(route))
  }

  registerRouterLink(routerLink: any) {
    const { routerLinks } = _private.get(this)

    routerLinks.add(routerLink)
  }

  unRegisterRouterLink(routerLink: any) {
    const { routerLinks } = _private.get(this)

    routerLinks.delete(routerLink)
  }

  registerRouterView(routerView: any) {
    const { routerViews } = _private.get(this)

    routerViews.set(routerView.name, routerView)
  }

  unRegisterRouterView(routerView: any) {
    const { routerViews } = _private.get(this)

    routerViews.delete(routerView.name)
  }

  navigate(url, pushState = true) {
    if (_private.get(this).currentUrl === url) return

    const { currentUri } = _private.get(this)

    let title = _private.get(this).title || ''
    // let { title = '' } = _private.get(self).getRoute(url, _private.get(self).routes) || {}

    _private.get(this).offset = 0

    if (url === currentUri.join('/')) return

    const { routerLinks } = _private.get(this)

    if (pushState) {
      window.history.pushState(
        {
          url,
          title,
        },
        title,
        url
      )
    }

    _private.get(this).title = title
    _private.get(this).currentUri = this.#getCurrentUri(url, this.baseUrl)
    _private.get(this).currentUrl = url

    this.dispatch()

    console.log(this.req)
  }

  setQueryParams(params = {}) {
    const { getQueryParams, title = '' } = _private.get(this)
    const queryParams = { ...getQueryParams(), ...params }

    let queryString = ''

    for (const param in queryParams)
      queryString += `${queryString.length ? '&' : ''}${param}=${queryParams[param]}`

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

    _private.get(this).routes.push(route)

    this.dispatch()

    return this
  }

  dispatch() {
    const { routes, currentUri, routerLinks, currentUrl } = _private.get(this)
    const { $vm } = this

    _private.get(this).error = false

    const req = this.#getRequest(currentUri, routes)

    if (req) {
      const { activeRoute } = req
      const components = activeRoute.components
      const cb = activeRoute.route

      let component = activeRoute.component

      this.req = req

      // This should reuse components not create a new component every time
      if (components) {
        for (const name in components) {
          if (components.hasOwnProperty(name)) {
            component = this.#createComponent(components[name], name, $vm)

            components[name] = component
          }
        }
      } else if (component && component.template) {
        component = this.#createComponent(component, 'default')
      }

      if (cb && typeof cb === 'function') cb(req)

      this.emit('navigate', {
        type: 'navigate',
        req,
        component,
      })
    } else {
      _private.get(router).error = true
    }

    if (_private.get(this).error) {
      this.#handleError(Error(`${currentUri} not found`))
    }

    routerLinks.forEach(({ $node }, i) => {
      const to = $node.getAttribute('to')

      if (to === req.fullPath) {
        $node.setAttribute('active', true)

        if (i) title = $node.textContent ?? ''
      } else $node.removeAttribute('active')
    })
  }

  #dispatch() {
    const { routes, currentUri } = _private.get(this)
    const { $vm } = this

    _private.get(this).error = false

    for (const route of routes) {
      const req = this.#getRequest(route)

      if (req) {
        let component = route.component
        const components = route.components
        const cb = route.route

        this.req = req

        // This should reuse components not create a new component every time
        if (components) {
          for (const name in components) {
            if (components.hasOwnProperty(name)) {
              component = this.#createComponent(components[name], name, $vm)

              components[name] = component
            }
          }
        } else if (component && component.template) {
          component = this.#createComponent(component, 'default')
        }

        if (cb && typeof cb === 'function') cb(req)

        this.emit('navigate', {
          type: 'navigate',
          req,
          component,
        })

        break
      } else {
        _private.get(this).error = true
      }
    }

    if (_private.get(this).error) {
      this.#handleError(Error(`${currentUri} not found`))
    }
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

  getViewport = (viewports: any[], name: string) =>
    viewports.find(viewport => viewport.name === name)

  getRoute = (uri: string, routes: any[]): any | null =>
    routes.find(route => route.uri === uri) || null

  #getRequest(path: string[], routes: any[]) {
    const queryParams = this.#getQueryParams()

    let offset = _private.get(this).offset
    let params: any = {}
    let matched: any[] = []
    let req: any | null = null
    let match: boolean = false
    let fullPath = ''
    let activeRoute: any | null = null

    routes = routes.slice(offset)

    for (const route of routes) {
      const { uri } = route
      const parts = uri.split('/').filter((path: string) => path)

      offset++

      if (parts.length === 0 || uri[0] === '/') parts.unshift('/')

      match = path.every((segment: any, i: number) => {
        const part = parts[i]

        if (part && (part === segment || /^:/.test(part))) {
          if (!/\/$/.test(fullPath)) {
            fullPath += segment === '/' ? segment : `/${segment}`
          } else if (segment !== '/') {
            fullPath += segment
          }

          if (/^:/.test(part)) params[part.replace(':', '')] = segment

          activeRoute = route

          return true
        } else if (part === undefined && route.children) {
          const childReq = this.#getRequest(path.slice(i), route.children)

          if (childReq) {
            fullPath += childReq.fullPath

            activeRoute = childReq.activeRoute

            matched.push(route, ...childReq.matched)

            params = childReq.params

            return true
          }
        } else if (part === undefined) matched.push(route)

        return false
      })

      if (match) {
        if (!matched.some((match: any) => match.uri === activeRoute.uri)) {
          matched.push(activeRoute)
        }

        req = {
          params,
          path,
          fullPath,
          matched,
          activeRoute,
          queryParams,
        }

        break
      }
    }

    if (!req) {
      const activeRoute = routes.find((route: any) => route.uri === '*')

      if (activeRoute)
        req = {
          params: [],
          path: activeRoute.uri,
          fullPath: activeRoute.uri,
          matched: activeRoute,
          activeRoute,
          queryParams,
        }
    }

    _private.get(this).offset = offset

    return req
  }

  getRequest({ uri }) {
    uri = uri.split('/').filter(Boolean)

    uri = uri.length === 0 ? ['/'] : uri[0] !== '/' ? ['/', ...uri] : uri

    const currentUri = this.#getCurrentUri(window.location.pathname, this.baseUrl)
    const params = {}

    let matched = false
    let queryParams
    let req = null

    if (currentUri.length === uri.length) {
      matched = currentUri.every((route, i) => {
        if (uri[i] && (uri[i] === route || /^:/.test(uri[i]))) {
          if (/^:/.test(uri[i])) {
            let key = uri[i].replace(':', '')

            params[key] = route
          }

          return true
        }
      })
    }

    if (matched) {
      queryParams = this.#getQueryParams()

      _private.get(this).error = false

      req = {
        params,
        path: currentUri,
        queryParams,
      }
    } else {
      _private.get(this).error = true
    }

    return req
  }

  #getCurrentUri(source: string, baseUri = ''): string[] {
    const uri = source.replace(baseUri, '').split('/').filter(Boolean)

    return uri.length === 0 ? ['/'] : uri.indexOf('/') === -1 ? ['/', ...uri] : uri
  }

  #getQueryParams(): Record<string, string> {
    let params = {}

    window.location.search
      .replace('?', '')
      .split(/&/g)
      .filter(Boolean)
      .forEach(param => {
        param = param.split('=')
        params[param[0]] = param[1]
      })

    return params
  }

  async #createComponent(component, name) {
    const { $vm } = this
    const { routerViews } = _private.get(this)
    const routerView = routerViews.get(name)
    const App = Reflect.getPrototypeOf($vm).constructor

    component = Object.assign({}, component)
    component.router = this
    component.parent = $vm

    const node = await App.component(component.name, component)

    this.#clearRouterViews(routerViews)

    routerView.$node.appendChild(node)

    component.instance = node.$vm

    return component
  }

  #clearRouterViews(routerViews) {
    routerViews.forEach(routerView => this.#clearRouterView(routerView))
  }

  #clearRouterView(routerView) {
    routerView.$node.innerHTML = ''
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
