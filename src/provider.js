export class Provider {
  get app () {
    return make('app')
  }

  on (...args) {
    return this.app.on.apply(this.app, args)
  }

  emit (...args) {
    return this.app.emit.apply(this.app, args)
  }

  singleton (name, service) {
    return this.app.register(name, service).asSingleton()
  }

  instance (name, service) {
    return this.app.register(name, service).asInstance()
  }
}
