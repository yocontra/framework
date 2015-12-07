import { Provider } from '../../container/provider'
import Koa from 'koa'
import merge from 'merge-descriptors'
import responseTime from 'koa-response-time'
import compress from 'koa-compress'
import views from 'koa-views'
import cors from 'koa-cors'
import body from 'koa-body'
import snakeRes from './snake-res'
import * as ctx from './context'
import * as res from './response'

export class ServerProvider extends Provider {
  constructor (config, log) {
    super()
    this.config = config
    this.log = log
  }

  register () {
    const koa = new Koa()
    koa.name = this.config.get('app.name')
    koa.env = this.config.get('env.node_env', 'development')
    koa.proxy = this.config.get('app.proxy', false)
    koa.subdomainOffset = this.config.get('app.subdomainOffset', 2)
    koa.keys = this.config.get('app.keys', ['secret', 'server', 'keys'])
    merge(koa.context, ctx)
    merge(koa.response, res)
    koa.use(responseTime())
    koa.use(cors())
    koa.use(body())
    koa.use(compress())
    koa.use(snakeRes())
    koa.use(this.log.middleware())
    this.instance('server', koa).asWeak()
  }
}
