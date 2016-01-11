/**
 * Import dependencies.
 */
import KoaRouter from 'koa-router'
import methods from 'methods'
import { singularize } from 'inflect'

/**
 * Router.
 */
export default class Router extends KoaRouter {

  /**
   * Add controller to registry.
   * @param {String} name     Name of controller.
   * @param {Object} instance Instance of controller.
   */
  static addController (name, instance) {
    Router.controllers[name] = instance
  }

  /**
   * Get controller from registry.
   * @param  {String} name Name of controller.
   * @return {Object}      Controller instance.
   */
  static controller (name) {
    return Router.controllers[name]
  }

  /**
   * Router constructor.
   * @param  {Object}      Options object.
   */
  constructor (opts = {}) {
    super(opts)
  }

  /**
   * Create and register a route.
   * @param  {String|Array} method    HTTP verb(s) to match.
   * @param  {String} name            Name of route.
   * @param  {String|RegExp} path     Path string or regular expression.
   * @param  {Function} ...middleware Middleware functions.
   * @return {Object}                 Instance of Router.
   */
  register (method, name, path, ...middleware) {
    if (!((typeof path === 'string' && !~path.indexOf('.')) || path instanceof RegExp)) {
      middleware = [path].concat(middleware)
      path = name
      name = null
    }

    if (typeof middleware[middleware.length - 1] === 'string') {
      const [controller, action] = middleware[middleware.length - 1].split(/\./)
      middleware.pop()
      middleware.push(Router.controller(controller)[action])
    }

    path = path.replace(/^\//, '')
    method = Array.isArray(method) ? method : [method]

    return super.register(path, method, middleware, { name })
  }

  /**
   * Create and register a route responding to all verbs.
   * @param  {String} name            Name of route.
   * @param  {String|RegExp} path     Path string or regular expression.
   * @param  {Function} ...middleware Middleware functions.
   * @return {Object}                 Instance of Router.
   */
  any (name, path, ...middleware) {
    return this.register(this.methods, name, path, ...middleware)
  }

  /**
   * Register a resource.
   * @param  {String} resource   Resource to register.
   * @param  {String} controller Controller to associate with resource.
   * @param  {Object} options    Options object.
   * @return {Object}            Instance of Router.
   */
   resource (resource, controller, options = { only: false, except: false }) {
     const { name, path } = getParts(resource)
     const id = options.id || `${singularize(name)}Id`
     const routes = {
       index: { verb: 'get', path: `${path}` },
       create: { verb: 'get', path: `${path}/create` },
       store: { verb: 'post', path: `${path}` },
       show: { verb: 'get', path: `${path}/:${id}` },
       edit: { verb: 'get', path: `${path}/:${id}/edit` },
       update: { verb: ['put', 'patch'], path: `${path}/:${id}` },
       destroy: { verb: 'delete', path: `${path}/:${id}` }
     }

     Object.keys(routes)
       .filter((route) => {
         if (Array.isArray(options.only)) {
           return options.only.indexOf(route) !== -1
         }
         if (Array.isArray(options.except)) {
           return options.except.indexOf(route) === -1
         }
         return true
       })
       .map((route) => {
         const { verb, path } = routes[route]
         this.register(verb, `${name}.${route}`, path, `${controller}.${route}`)
       })

     return this
   }
}

/*
 * Loop over all verbs available and register alias methods.
 */
methods.map((method) => {
  Router.prototype[method] = function (name, path, ...middleware) {
    return this.register(method, name, path, ...middleware)
  }
})

/**
* Return object of resource parts.
* @param  {String} resource Resource to parse.
* @return {Object}          Name and path of resource.
*/
function getParts (resource) {
  const [parent, child] = resource.split('.')

  if (typeof child === 'undefined') {
    return { name: parent, path: `/${parent}` }
  } else {
    return { name: child, path: `/${parent}/${child}` }
  }
}
