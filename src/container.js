import { EventEmitter } from 'events'
import { Binding } from './binding'
import { parseArgs, instantiate } from './helpers'

export default class Container extends EventEmitter {
  constructor () {
    super()
    this.setMaxListeners(0)
    this.bindings = {}
  }

  bind (name, thing) {
    const existing = this.exists(name) ? this.bindings[name] : false
    if (existing && !existing.isOverridable()) {
      throw new Error(`Cannot override: ${name}`)
    }

    const binding = new Binding(name, thing)

    this.bindings[name] = binding
    return binding
  }

  alias (alias, name, { overwrite = false } = {}) {
    if (!this.exists(alias) && !overwrite) {
      this.bindings[alias] = this.bindings[name]
    }
    return this
  }

  exists (name) {
    return !!this.bindings[name]
  }

  make (name) {
    if (typeof name === 'string') {
      const {thing, deps} = this.resolve(name)
      return this.build(thing, deps)
    }

    if (typeof name === 'function') {
      return this.build(name, parseArgs(name))
    }

    return null
  }

  resolve (thing) {
    if (!this.exists(thing)) {
      throw new Error(`Cannot resolve dependency "${thing}"`)
    }

    return this.bindings[thing]
  }

  build (thing, deps) {
    if (typeof thing === 'string' || typeof thing === 'object') {
      return thing
    }

    const dependencies = deps.map((dep) => this.make(dep))

    return instantiate(thing, dependencies)
  }
}
