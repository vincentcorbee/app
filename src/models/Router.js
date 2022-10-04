import Emitter from './Emitter'
import { createNewElement } from '../lib/U'
import App from './App'

const _private = new WeakMap()

const getCurrentUri = self =>
  window.location.pathname
    .replace(self.baseUrl, '')
    .split('/')
    .filter(path => path)

const getQueryParams = () => {
  let params = {}
  window.location.search
    .replace('?', '')
    .split(/&/g)
    .filter(param => param)
    .forEach(param => {
      param = param.split('=')
      params[param[0]] = param[1]
    })
  return params
}

const getViewport = (viewports, name) =>
  viewports.find(viewport => viewport.name === name)

const getRequest = (self, { uri }) => {
  uri = uri.split('/').filter(path => path)

  let { getCurrentUri, getQueryParams } = _private.get(self)
  let matched = false
  let currentUri = getCurrentUri(self)
  let params = {}
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
    queryParams = getQueryParams()
    _private.get(self).err = false
    req = {
      params,
      path: currentUri,
      queryParams: queryParams,
    }
  } else {
    _private.get(self).err = true
  }

  return req
}
const clearViewport = viewport => (viewport.node.innerHTML = '')
const clearViewports = viewports => viewports.forEach(clearViewport)
const createComponent = (router, component, name) => {
  const { getViewport, viewports } = _private.get(router)
  const viewport = getViewport(viewports, name)
  component = Object.assign({}, component)
  component.router = router
  component = new App(component).$mount()
  clearViewports(viewports)
  viewport.node.appendChild(component.node)
  return component
}
const dispatch = self => {
  let { routes, getRequest, getCurrentUri } = _private.get(self)
  for (let route of routes) {
    let req = getRequest(self, route)
    if (req) {
      let component = route.component
      let components = route.components
      let cb = route.route
      self.req = req
      // This should reuse components not create a new component every time
      if (components) {
        for (let name in components) {
          if (components.hasOwnProperty(name)) {
            component = createComponent(self, components[name], name)
          }
        }
      } else if (component && component.template) {
        component = createComponent(self, component, 'default')
      }
      if (cb && typeof cb === 'function') {
        cb(req)
      }
      self.emit('navigate', {
        type: 'navigate',
        req,
        component,
      })
      break
    }
  }
  if (_private.get(self).err) {
    let route = routes.find(route => route.err)
    if (route) {
      route.err(false, {})
    } else {
      console.warn(`${getCurrentUri(self).join('/')} not found`)
    }
  }
}

export default class Router extends Emitter {
  constructor({ baseUrl = '' } = {}) {
    super()
    const self = this
    _private.set(self, {
      dispatch,
      getViewport,
      getCurrentUri,
      getQueryParams,
      getRequest,
      currentUri: '',
      routes: [],
      viewports: [],
      err: false,
      baseUrl:
        baseUrl === './'
          ? getCurrentUri().pop()
          : baseUrl === '/'
          ? getCurrentUri().join('/')
          : baseUrl,
    })
    // Test with history API
    let state = window.history.state || {
      url: '/',
      title: '',
    }
    let viewports = Array.prototype.slice.call(document.getElementsByTagName('r-view'))
    let rTags = Array.prototype.slice.call(document.getElementsByTagName('r-link'))

    const clickListener = e => {
      e.preventDefault()
      let { currentUri } = _private.get(self)
      let a = e.target
      let url = a.getAttribute('href')
      if (url === currentUri) {
        return
      }
      let ctrlKey = e.ctrlKey
      let shiftKey = e.shiftKey
      let title = a.textContent
      let active = document.querySelector('.r-link-active')
      if (shiftKey || ctrlKey) {
        return true
      }
      _private.get(self).currentUri = url
      window.history.pushState(
        {
          url,
          title,
        },
        title,
        url
      )
      if (active) {
        active.classList.remove('r-link-active')
      }
      a.classList.add('r-link-active')
      _private.get(self).dispatch(self)
    }
    _private.get(self).viewports = viewports.map(viewport => {
      let attributes = Array.prototype.slice
        .call(viewport.attributes)
        .map(attr => `${attr.nodeName}=${attr.nodeValue}`)
      let div = createNewElement('div', attributes)
      viewport.parentNode.replaceChild(div, viewport)
      return {
        node: div,
        name: viewport.getAttribute('name') || 'default',
      }
    })
    rTags.forEach(rTag => {
      let aTag = createNewElement('a', [
        `href=${rTag.getAttribute('to')}`,
        `innerHTML=${rTag.innerHTML}`,
      ])
      rTag.parentNode.replaceChild(aTag, rTag)
      aTag.addEventListener('click', clickListener)
    })
    window.history.replaceState(state, null, '')
    window.addEventListener('popstate', e => console.log(e.state))
    // console.log(window.history.state, getCurrentUri(self))
    // end
  }
  get baseUrl() {
    return _private.get(this).baseUrl
  }
  set baseUrl(path) {
    _private.get(this).baseUrl = path
  }
  set(...args) {
    args.forEach(route => _private.get(this).routes.push(route))
    // _private.get(this).dispatch(this)
  }
  addRoute(route) {
    let self = this
    if (typeof route !== 'object') {
      throw new TypeError(route + ' is not a object')
    }
    _private.get(self).routes.push(route)
    // _private.get(self).dispatch(self)
    return this
  }
  dispatch() {
    _private.get(this).dispatch(this)
  }
}
