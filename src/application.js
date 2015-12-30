import Koa from 'koa'
import merge from 'merge-descriptors'
import Kernel from './kernel'
import Router from './router'
import Controller from './controller'

export default class Application extends Kernel {

  constructor (path = process.cwd()) {
    super(path)
    Router.app = this
    Controller.app = this
    this._router = new Router()
    this._koa = new Koa()
    this._koa.env = this.env()
    this._koa.name = this.config('app.name')
    this._koa.proxy = this.config('app.proxy', false)
    this._koa.subdomainOffset = this.config('app.subdomainOffset', 2)
    this._koa.keys = this.config('app.keys', ['secret', 'server', 'keys'])
    merge(this._koa.context, require('./context'))
    merge(this._koa.response, require('./response'))
  }

  use (path, ...args) {
    if (([path].concat(args).length === 2) && (args[0] instanceof Router)) {
      return this._router.use(path, args[0].routes())
    }
    return this._koa.use.apply(this._koa, [path].concat(args))
  }

  bootstrap () {
    const app = this
    this.use(function * (next) {
      this.make = app.make.bind(app)
      yield next
    })
    this.use(this._router.routes(), this._router.allowedMethods())
    this._koa.on('error', this.emit.bind(this, 'error'))
    return this._koa.callback.apply(this._koa)
  }
}
