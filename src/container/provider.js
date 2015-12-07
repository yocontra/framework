export class Provider {
  get app () {
    return make('app')
  }

  singleton (name, service) {
    return this.app.register(name, service).asSingleton()
  }

  instance (name, service) {
    return this.app.register(name, service).asInstance()
  }
}
