'use strict'

const fs = require('fs')
const resolve = require('path').resolve
const Config = require('kratos-config').Config
const _ = require('lodash')
const env = require('process-env')

class Loader extends Config {

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
      this.config = path
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
    if (!fs.existsSync(file)) {
      throw Error('File does not exist. ' + file)
    }
    file = file.substr(0, file.length - 3)
    let config = require(file)
    this.config = _.defaultsDeep(config, this.defaultConfig)
  }

  fromDirectory (path) {
    if (!fs.existsSync(path)) {
      throw Error('Path does not exist. ' + path)
    }

    let config = {}

    fs.readdirSync(path).filter((file) => {
      return file.endsWith('.js')
    }).forEach((file) => {
      file = file.substr(0, file.length - 3)
      let prodConfig = require(path + '/' + file)
      let envConfig = {}
      let envFile = path + '/' + this.env + '/' + file
      if (fs.existsSync(envFile + '.js')) {
        envConfig = require(envFile)
      }
      config[file] = _.defaultsDeep(envConfig, prodConfig)
    })
    this.config = _.defaultsDeep(config, this.defaultConfig)
  }
}

module.exports = Loader
