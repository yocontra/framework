import Koa from 'koa'
import merge from 'merge-descriptors'
import { Container } from './container'
import { Config } from './config'
import { Router } from './router'
import * as ctx from './context'
import * as res from './response'

export class Application extends Container {
  constructor () {
    super()
    GLOBAL.make = this.make.bind(this)
    this.router = new Router()
    this.config = new Config()
    this.koa = new Koa()
    this.koa.name = this.config.get('app.name')
    this.koa.env = this.config.get('env.node_env', 'development')
    this.koa.proxy = this.config.get('app.proxy', false)
    this.koa.subdomainOffset = this.config.get('app.subdomainOffset', 2)
    this.koa.keys = this.config.get('app.keys', ['secret', 'server', 'keys'])
    merge(this.koa.context, ctx)
    merge(this.koa.response, res)
    this.register('App', this).asInstance()
    this.register('Route', this.router).asInstance()
    this.koa.on('error', (err) => this.emit('error', err))
  }

  use (...middlewares) {
    middlewares.map
  }

  head (...args) {
    return this.router.head.apply(this.router, args)
  }

  options (...args) {
    return this.router.options.apply(this.router, args)
  }

  get (...args) {
    return this.router.get.apply(this.router, args)
  }

  post (...args) {
    return this.router.post.apply(this.router, args)
  }

  put (...args) {
    return this.router.put.apply(this.router, args)
  }

  patch (...args) {
    return this.router.patch.apply(this.router, args)
  }

  delete (...args) {
    return this.router.delete.apply(this.router, args)
  }

  registerService (service) {
    this.make(service).register()
    return this
  }

  bootstrap () {
    this.use(this.router.routes())
    return this.koa.callback.apply(this.koa)
  }
}
