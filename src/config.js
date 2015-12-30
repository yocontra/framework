import { exists, readDir, defaults } from './helpers'

export default class Config {

  constructor (env, path) {
    this.env = env
    this.config = {
      app: {
        name: 'Kratos Application',
        hostname: '0.0.0.0',
        port: 1337
      }
    }
    this.load(path)
  }

  load (path) {
    readDir(path).filter((file) => {
      return file.endsWith('.js')
    }).forEach((file) => {
      file = file.substr(0, file.length - 3)
      let prodConfig = require(`${path}/${file}`)
      let envConfig = {}
      let envFile = `${path}/${this.env}/${file}`
      if (exists(`${envFile}.js`)) {
        envConfig = require(envFile)
      }
      this.config[file] = defaults(envConfig, prodConfig, this.config[file] || {})
    })
    return this
  }

  has (path, config = this.config) {
    if (typeof config !== 'object' || config === null) {
      return false
    }

    if (typeof path === 'string') {
      path = path.split('.')
    }

    if (!(path instanceof Array) || path.length === 0) {
      return false
    }

    path = path.slice()

    let key = path.shift()

    if (path.length === 0) {
      return Object.hasOwnProperty.apply(config, [key])
    } else {
      return this.has(path, config[key])
    }
  }

  get (path, defaultValue = false, config = this.config) {
    if (typeof config !== 'object' || config === null) {
      return null
    }

    if (typeof path === 'string') {
      path = path.split('.')
    }

    path = path.slice()

    let key = path.shift()

    if (path.length === 0) {
      return config[key] || defaultValue
    }

    return this.get(path, defaultValue, config[key])
  }

  put (path, value, config = this.config) {
    if (typeof config !== 'object' || config === null) {
      return false
    }

    if (typeof path === 'string') {
      path = path.split('.')
    }

    path = path.slice()

    let key = path.shift()

    if (path.length === 0) {
      config[key] = value
    } else {
      if (typeof config[key] === 'undefined') {
        config[key] = {}
      }

      if (typeof config[key] !== 'object' || config[key] === null) {
        return false
      }

      return this.put(path, value, config[key])
    }
  }
}
