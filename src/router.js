import KoaRouter from 'koa-router'
import methods from 'methods'
import { singularize } from 'inflect'
import { exists, readDir } from './helpers'

export default class Router extends KoaRouter {
  static controllers = {}

  static addController (name, instance) {
    Router.controllers[name] = instance
  }

  static controller (name) {
    return Router.controllers[name]
  }

  constructor (opts = {}) {
    super(opts)
    methods.forEach((method) => Router.prototype[method] = this.register.bind(this, method))
  }

  register (method, name, path, ...middleware) {
    if (!((typeof path === 'string' && path.indexOf('.') === -1) || path instanceof RegExp)) {
      middleware = [path].concat(middleware)
      path = name
      name = null
    }

    if (typeof middleware[middleware.length - 1] === 'string') {
      const [controller, action] = middleware[middleware.length - 1].split(/\./)
      middleware.pop()
      middleware.push(Router.controller(controller)[action])
    }

    super.register(path.replace(/^\//, ''), Array.isArray(method) ? method : [method], middleware, {
      name: name
    })

    return this
  }

  resource (resource, controller, options = { only: false, except: false }) {
    const { name, url } = this.getParts(resource)
    const id = options.id || `${singularize(name)}Id`
    const routes = {
      index: { method: 'get', name: `${name}.index`, url: `${url}`, action: `${controller}.index` },
      create: { method: 'get', name: `${name}.create`, url: `${url}/create`, action: `${controller}.create` },
      store: { method: 'post', name: `${name}.store`, url: `${url}`, action: `${controller}.store` },
      show: { method: 'get', name: `${name}.show`, url: `${url}/:${id}`, action: `${controller}.show` },
      edit: { method: 'get', name: `${name}.edit`, url: `${url}/:${id}/edit`, action: `${controller}.edit` },
      update: { method: ['put', 'patch'], name: `${name}.update`, url: `${url}/:${id}`, action: `${controller}.update` },
      destroy: { method: 'delete', name: `${name}.destroy`, url: `${url}/:${id}`, action: `${controller}.destroy` }
    }

    Object.keys(routes)
      .filter((route) => {
        if (Array.isArray(options.only)) {
          return options.only.indexOf(route) !== -1
        }
        if (Array.isArray(options.except)) {
          return options.except.indexOf(route) === -1
        }
      })
      .map((route) => {
        this.register(routes[route].method, routes[route].name, routes[route].url, routes[route].action)
      })

    return this
  }

  getParts (resource) {
    const [parent, child] = resource.split('.')

    if (typeof child === 'undefined') {
      return { name: parent, url: `/${parent}` }
    } else {
      return { name: child, url: `/${parent}/${child}` }
    }
  }
}
