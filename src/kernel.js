import env from 'process-env'
import Container from './container'
import Config from './config'
import Provider from './provider'

export default class Kernel extends Container {

  constructor (path = process.cwd()) {
    super()
    this._config = new Config(this.env(), path)
    this._config.put('env', env.all())
    Provider.app = this
  }

  env (match = false) {
    const environment = env.get('node_env', 'development')
    if (match) {
      return environment === match.toLowerCase()
    }
    return environment
  }

  config (...args) {
    return this._config.get.apply(this._config, args)
  }

  register (Provider) {
    (new Provider()).register()
    return this
  }

  use (...args) {
    return this
  }

  command (...args) {
    return this
  }
}
