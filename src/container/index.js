import { Binding } from './binding'
import { parseArgs, instantiate } from '../helpers'

export class Container {
  constructor () {
    this.bindings = {}
  }

  register (thing, fn) {
    const existing = this.bindings[thing]
    if (existing && !existing.isWeak()) {
      throw new Error(`Cannot override: ${thing}`)
    }

    const binding = new Binding(thing, fn, (bind) => {
      return this.build(bind.source, bind.getDependencyNames())
    })

    this.bindings[thing] = binding
    return binding
  }

  exists (thing) {
    return !!this.bindings[thing]
  }

  factory () {
    return (thing) => this.make(thing)
  }

  make (thing) {
    if (typeof thing === 'string') {
      return this.resolve(thing).build()
    }

    if (typeof thing === 'function') {
      return this.build(thing, parseArgs(thing))
    }

    return null
  }

  resolve (thing) {
    if (!this.exists(thing)) {
      throw new Error(`Cannot resolve dependency "${thing}"`)
    }

    return this.bindings[thing]
  }

  build (thing, dependencies) {
    const deps = []

    for (let i = 0; i < dependencies.length; i++) {
      deps.push(this.make(dependencies[i]))
    }

    return instantiate(thing, deps)
  }
}
