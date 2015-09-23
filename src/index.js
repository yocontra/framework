import http from 'http'
import Koa from 'koa'
import Router from 'kratos-router'
import Config from 'kratos-config'
import Loader from './config'
import env from 'process-env'
import mount from 'koa-mount'

class Kratos extends Koa {

  constructor (config) {
    super()
    this._setupConfig(config)
    this._setupApp()
    this._setupRouter()
    this._setupHeaders()
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
    Config.instance = (new Loader()).load(config)
  }

  _setupApp () {
    this.name = Config.get('app.name')
    this.proxy = Config.get('app.proxy')
    this.subdomainOffset = Config.get('app.subdomainOffset')
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
    port = port || Config.get('app.port')
    http.createServer(this.callback())
    .listen(port, '0.0.0.0', () => {
      console.log(`${Config.get('app.name')} started on http://0.0.0.0:${port} in ${this.env} mode.`)
    })
  }

}

export default function (config) {
  return new Kratos(config)
}
