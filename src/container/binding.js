import { parseArgs } from '../helpers'

export class Binding {
  constructor (name, source, factory) {
    this.name = name
    this.source = source
    this.factory = factory
    this.cached = typeof source !== 'function' ? source : null
    this.deps = null
    this.weak = false
    this.singleton = false
  }

  asWeak () {
    this.weak = true
    return this
  }

  asWeakSauce () {
    return this.asWeak.apply(this)
  }

  isWeak () {
    return this.weak
  }

  getDependencyNames () {
    if (this.deps) {
      return this.deps
    }

    if (typeof this.source === 'function') {
      this.deps = parseArgs(this.source)
    } else {
      this.deps = []
    }

    return this.deps
  }

  asSingleton () {
    this.singleton = true
    return this
  }

  asInstance () {
    this.cached = this.source
    return this
  }

  build () {
    if (this.cached) {
      return this.cached
    }

    const thing = this.factory(this)

    if (this.singleton) {
      this.cached = thing
    }

    return thing
  }
}
