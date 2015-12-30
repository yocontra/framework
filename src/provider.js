export default class Provider {
  env (...args) {
    return Provider.app.env.apply(Provider.app, args)
  }

  config (...args) {
    return Provider.app.config.apply(Provider.app, args)
  }

  make (...args) {
    return Provider.app.make.apply(Provider.app, args)
  }

  use (...args) {
    return Provider.app.use.apply(Provider.app, args)
  }

  command (...args) {
    return Provider.app.command.apply(Provider.app, args)
  }

  on (...args) {
    return Provider.app.on.apply(Provider.app, args)
  }

  emit (...args) {
    return Provider.app.emit.apply(Provider.app, args)
  }

  bind (name, service) {
    return Provider.app.bind(name, service)
  }
}
