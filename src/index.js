'use strict'

let http = require('http')
let dirname = require('path').dirname
let Koa = require('koa')
let Router = require('kratos-router')
let mount = require('koa-mount')
let responseTime = require('koa-response-time')
let logger = require('koa-logger')
let compress = require('koa-compress')
let views = require('koa-views')

class Kratos extends Koa {

  constructor (options) {
    super()
    this._options = options || {}
    this._router = new Router()
    this._setupRouter()
    this._setupHeaders()
    this._setupMiddleware()
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

  _setupRouter () {
    super.use(this._router.routes())
    super.use(this._router.allowedMethods())
    this._router.methods.map((method) => {
      return method.toLowerCase()
    }).forEach((method) => {
      this[method] = this._router[method].bind(this._router)
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
      root: this._options.views || dirname(module.parent.filename) + '/views',
      default: this._options.engine || 'jade'
    }))
  }

  _inEnv (env) {
    return this.env.toLowerCase() === env.toLowerCase()
  }

  use () {
    this._router.use.apply(this._router, arguments)
    return this
  }

  route () {
    return this._router.url.apply(this._router, arguments)
  }

  param () {
    return this._router.param.apply(this._router, arguments)
  }

  mount (path, app) {
    super.use(mount(path, app))
    return this
  }

  run (port, address) {
    port = port || process.env.PORT || 1337
    address = address || process.env.ADDRESS || '0.0.0.0'
    http.createServer(this.callback()).listen(port, address, () => {
      console.log(`Kratos app started on http://${address}:${port} in ${this.env} mode.`)
    })
  }

}

let kratos = module.exports = function (options) {
  return new kratos.Application(options)
}

kratos.Application = Kratos
