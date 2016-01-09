/**
 * Import dependencies.
 */
import Command from '../command'

/**
 * Version command.
 */
export default class Version extends Command {
  /**
   * Set description of command.
   */
  get description () {
    return 'output the version number'
  }

  /**
   * Command action.
   */
  action () {
    return Command.app.versionInformation()
  }
}
