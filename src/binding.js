import { parseArgs } from './helpers'

export class Binding {
  constructor (name, thing) {
    this.name = name
    this.thing = thing
    this.deps = parseArgs(thing)
    this.override = false
  }

  canOverride () {
    this.override = true
    return this
  }

  isOverridable () {
    return this.override
  }
}
