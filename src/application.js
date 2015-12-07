import { Container } from './container'

export class Application extends Container {
  constructor () {
    super()
    GLOBAL.make = this.make.bind(this)
    this.register('app', this).asInstance()
  }

  registerService (service) {
    this.make(service).register()
    return this
  }
}
