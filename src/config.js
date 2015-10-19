import { existsSync as exists, readdirSync as readDir } from 'fs'
import { resolve } from 'path'
import _ from 'lodash'
import env from 'process-env'

export default class Config {

  constructor () {
    this.config = {}
  }

  get env () {
    return env('node_env') || 'development'
  }

  get defaultConfig () {
    return {
      app: {
        name: env('app_name') || 'Kratos Application',
        keys: [env('app_key') || 'SomeRandomString'],
        port: env('app_port') || env('port') || 1337,
        proxy: false,
        subdomainOffset: 2
      },
      views: {
        path: process.cwd() + '/views',
        engine: 'jade'
      }
    }
  }

  load (path) {
    if (!path) {
      this.config = this.defaultConfig
    }
    if (typeof path === 'object') {
      this.config = _.defaultsDeep(path, this.defaultConfig)
    }

    if (typeof path === 'string') {
      this.fromString(resolve(path))
    }
    return this
  }

  fromString (path) {
    if (path.endsWith('.js')) {
      this.fromFile(path)
    } else {
      this.fromDirectory(path)
    }
  }

  fromFile (file) {
    if (!exists(file)) {
      throw Error('File does not exist. ' + file)
    }
    file = file.substr(0, file.length - 3)
    let config = require(file)
    this.config = _.defaultsDeep(config, this.defaultConfig)
  }

  fromDirectory (path) {
    if (!exists(path)) {
      throw Error('Path does not exist. ' + path)
    }

    let config = {}

    readDir(path).filter((file) => {
      return file.endsWith('.js')
    }).forEach((file) => {
      file = file.substr(0, file.length - 3)
      let prodConfig = require(path + '/' + file)
      let envConfig = {}
      let envFile = path + '/' + this.env + '/' + file
      if (exists(envFile + '.js')) {
        envConfig = require(envFile)
      }
      config[file] = _.defaultsDeep(envConfig, prodConfig)
    })
    this.config = _.defaultsDeep(config, this.defaultConfig)
  }
}
