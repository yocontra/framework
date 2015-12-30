import Command from '../command'

export default class Version extends Command {
  get description () {
    return 'output the version number'
  }

  action () {
    return Command.app.versionInformation()
  }
}
