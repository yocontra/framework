export default class Command {
  get name () {
    return this.constructor.name
      .replace(/(.+)Command/, '$1')
      .replace(/([a-z]+|[0-9]+|(?:[A-Z][a-z]+)|(?:[A-Z]+(?=(?:[A-Z][a-z])|[^AZa-z]|[$\d\n])))/, '$1:')
      .replace(/(.+)(:)$/, '$1').toLowerCase()
  }

  get blocking () {
    return false
  }

  get signature () {
    return false
  }

  get description () {
    return 'No description provided.'
  }

  get options () {
    return false
  }

  action () {
    console.log(`
  error: missing action for \`${this.name}\`
    `)
  }

  env (...args) {
    return Command.app.env.apply(Command.app, args)
  }

  make (...args) {
    return Command.app.make.apply(Command.app, args)
  }

  config (...args) {
    return Command.app.config.apply(Command.app, args)
  }

  on (...args) {
    return Command.app.on.apply(Command.app, args)
  }

  emit (...args) {
    return Command.app.emit.apply(Command.app, args)
  }
}
