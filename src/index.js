import http from 'http'
import { dirname, join } from 'path'
import Koa from 'koa'
import Router from 'kratos-router'
import mount from 'koa-mount'
import responseTime from 'koa-response-time'
import logger from 'koa-logger'
import compress from 'koa-compress'
import views from 'koa-views'
import Config from 'kratos-config'
import Loader from './config'
import env from 'process-env'

class Kratos extends Koa {

  constructor (config) {
    super()
    this._setupConfig(config)
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

  _setupConfig (config) {
    let loader = new Loader()
    Config.setInstance(loader.load(config))
    module.parent.paths.push(join(dirname(__dirname), 'node_modules'))
  }

  _setupApp () {
    this.name = Config('app.name')
    this.proxy = Config('app.proxy')
    this.subdomainOffset = Config('app.subdomainOffset')
  }

  _setupRouter () {
    this.router = new Router()
    this.use(this.router.routes())
    this.use(this.router.allowedMethods())
    this.router.methods.map((method) => {
      return method.toLowerCase()
    }).forEach((method) => {
      this[method] = this.router[method].bind(this.router)
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
    this.use(responseTime())
    if (this.inDevelopment) {
      this.use(logger())
    }
    this.use(compress())
    this.use(views({
      root: Config('views.path'),
      default: Config('views.engine')
    }))
  }

  route () {
    return this.router.url.apply(this.router, arguments)
  }

  param () {
    return this.router.param.apply(this.router, arguments)
  }

  mount (path, app) {
    this.use(mount(path, app))
    return this
  }

  run (port) {
    port = port || Config('app.port')
    http.createServer(this.callback())
    .listen(port, '0.0.0.0', () => {
      console.log(`${Config('app.name')} started on http://0.0.0.0:${port} in ${this.env} mode.`)
    })
  }

}

export default function (config) {
  return new Kratos(config)
}
