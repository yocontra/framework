/**
 * Import dependencies.
 */
import { resolve } from 'path'
import program from 'commander'
import Promise from 'bluebird'
import { VERSION } from '../'
import Kernel from './kernel'
import Command from './command'
import { readDir } from './helpers'

/**
 * CLI application
 */
export default class CLI extends Kernel {
  /**
   * Constructor
   * @param  {String} path Path location of configuration directory.
   * @param  {Boolean} standalone Standalone CLI for global usage.
   */
  constructor (path = process.cwd(), standalone = false) {
    super(path)
    this.commands = []
    this.standalone = standalone
    program.version(VERSION, '-v, --version')
    Command.app = this
  }

  /**
   * Register command with app.
   * @param  {Class} Command Command class.
   */
  command (Command) {
    this.commands.push(Command)
    return this
  }

  /**
   * Bootstrap the application.
   */
  bootstrap () {
    // Load up all local commands.
    const commands = resolve(__dirname, 'commands')
    readDir(commands)
      .filter((command) => command.endsWith('.js'))
      .map((command) => {
        if (!(command === 'start.js' && this.standalone)) {
          this.command(require(resolve(commands, command)))
        }
      })

    // Loop over all commands and bootstrap Commander.
    this.commands.map((Command) => new Command())
    .forEach((command) => {
      // Register command name and signature.
      const cmd = program.command(`${command.name}${command.signature ? ` ${command.signature}` : ''}`)

      // Register command description.
      cmd.description(command.description)

      // Is there options?
      if (command.options) {
        // Are these options an object?
        if (toString.call(command.options) === '[object Object]') {
          // Register command options object.
          cmd.option(command.options.flags, command.options.description)
        } else if (toString.call(command.options) === '[object Array]') {
          // Register all command options objects.
          command.options.map((option) => cmd.option(option.flags, option.description))
        }
      }

      // Register command action promise chain.
      cmd.action((...args) => {
        Promise.resolve()
          // Pass arguments to Command action.
          .then(() => command.action(...args))

          // If command is not blocking exit afterwords.
          .then(() => {
            if (!command.blocking) {
              process.exit()
            }
          })
          // Catch any possible errors and exit appropriately.
          .catch((err) => {
            console.error(err.stack)
            process.exit(1)
          })
      })
    })

    // Parse arguments passed for Commander.
    program.parse(process.argv)

    // Output help if no command passed.
    if (!process.argv.slice(2).length) {
      program.outputHelp()
      process.exit()
    }
  }
}
