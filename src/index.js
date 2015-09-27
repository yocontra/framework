import http from 'http'
import Koa from 'koa'
import Router from 'kratos-router'
import config from 'kratos-config'
import Loader from './config'
import env from 'process-env'
import mount from 'koa-mount'
import responseTime from 'koa-response-time'
import logger from 'koa-logger'
import compress from 'koa-compress'
import views from 'koa-views'

class Kratos extends Koa {

  constructor (path) {
    super()
    this._setupConfig(path)
    this._setupApp()
    this._setupRouter()
    this._setupHeaders()
    this._setupMiddleware()
  }

  set env (value) {
    return value
  }

  get env () {
    return env('node_env') || 'development'
  }

  set router (router) {
    this._router = router
  }

  get router () {
    if (this._router) {
      return this._router
    }
    return new Router()
  }

  get inProduction () {
    return this._inEnv('production')
  }

  get inDevelopment () {
    return this._inEnv('development')
  }

  get inTesting () {
    return this._inEnv('test')
  }

  _inEnv (env) {
    return this.env.toLowerCase() === env.toLowerCase()
  }

  _setupConfig (path) {
    if (!config.instance) {
      config.instance = (new Loader()).load(path)
    }
  }

  _setupApp () {
    this.name = config.get('app.name')
    this.proxy = config.get('app.proxy')
    this.subdomainOffset = config.get('app.subdomainOffset')
  }

  _setupRouter () {
    this.router = new Router()
    this.router.methods.map(method => {
      const verb = method.toLowerCase()
      this[verb] = this.router[verb].bind(this.router)
    })
  }

  _setupHeaders () {
    this.use(function * headers (next) {
      yield* next
      var type = this.response.type
      if (type && ~type.indexOf('text/html')) {
        this.response.set('X-Frame-Options', 'SAMEORIGIN')
        this.response.set('X-XSS-Protection', '1; mode=block')
      }
    })
  }

  _setupMiddleware () {
    this.use(this.router.allowedMethods())
    this.use(responseTime(), logger(), compress())
    this.use(views({
      root: config.get('views.path'),
      default: config.get('views.engine')
    }))
  }

  use () {
    const middlewares = Array.prototype.slice.call(arguments)
    middlewares.forEach((middleware) => {
      super.use(middleware)
    })
    return this
  }

  param () {
    return this.router.param.apply(this.router, arguments)
  }

  mount (path, app) {
    this.use(mount(path, app))
    return this
  }

  run (port) {
    this.use(this.router.routes())
    port = port || config.get('app.port')
    http.createServer(this.callback())
    .listen(port, '0.0.0.0', () => {
      console.log(`${config.get('app.name')} started on http://0.0.0.0:${port} in ${this.env} mode.`)
    })
  }

}

export default function (config) {
  return new Kratos(config)
}
