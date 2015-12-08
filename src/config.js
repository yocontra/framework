import { exists, readDir, defaults } from './helpers'
import env from 'process-env'

const defaultConfig = {
  app: {
    name: 'Kratos Application',
    address: '0.0.0.0',
    port: 1337
  },
  env: env.all()
}

export class Config {

  constructor (config = defaultConfig) {
    this.env = env.get('node_env', 'development')
    this.config = config
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
