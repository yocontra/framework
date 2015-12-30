import { resolve } from 'path'
import program from 'commander'
import Promise from 'bluebird'
import { VERSION } from '../'
import Kernel from './kernel'
import Command from './command'
import { readDir } from './helpers'

export default class CLI extends Kernel {
  constructor (path = process.cwd(), standalone = false) {
    super(path)
    this.commands = []
    this.standalone = standalone
    program.version(VERSION, '-v, --version')
    Command.app = this
  }

  command (Command) {
    this.commands.push(Command)
    return this
  }

  bootstrap () {
    readDir(resolve(__dirname, 'commands'))
      .filter((command) => command.endsWith('.js'))
      .map((command) => {
        if (!(command === 'start.js' && this.standalone)) {
          this.command(require(resolve(__dirname, 'commands', command)))
        }
      })
    this.commands.forEach((Command) => {
      const command = new Command()
      const cmd = program.command(`${command.name}${command.signature ? ` ${command.signature}` : ''}`)
      cmd.description(command.description)
      if (command.options) {
        if (toString.call(command.options) === '[object Object]') {
          cmd.option(command.options.flags, command.options.description)
        } else if (toString.call(command.options) === '[object Array]') {
          command.options.map((option) => cmd.option(option.flags, option.description))
        }
      }
      cmd.action((...args) => {
        Promise.resolve().then(() => command.action.apply(command, args))
          .then(() => {
            if (!command.blocking) {
              process.exit()
            }
          })
          .catch((err) => {
            console.error(err)
            process.exit(1)
          })
      })
    })
    program.parse(process.argv)
    if (!process.argv.slice(2).length) {
      program.outputHelp()
      process.exit()
    }
  }
}
