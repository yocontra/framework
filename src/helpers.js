import { existsSync, readdirSync } from 'fs'
import { defaultsDeep, snakeCase as lodashSnakeCase } from 'lodash'
import Promise from 'bluebird'

export const exists = existsSync.bind(existsSync)

export const readDir = readdirSync.bind(readdirSync)

export const defaults = defaultsDeep.bind(defaultsDeep)

export const snakeCase = lodashSnakeCase.bind(lodashSnakeCase)

export function snakeCaseDeep (obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] && typeof obj[prop] === 'object') {
        obj[prop] = snakeCaseDeep(obj[prop])
      }
      let val = obj[prop]
      delete obj[prop]
      obj[snakeCase(prop)] = val
    }
  }
  return obj
}

export const FUNCTION_ARGS = /(?:function|constructor)[^\(]*\(([^\)]*)/m

export function parseArgs (fn) {
  const matches = []
  let args = fn.toString().match(FUNCTION_ARGS)

  if (args) {
    args = args[1].replace(/[ ]*,[ ]*/, ',')
      .split(',')

    for (let i = 0; i < args.length; i++) {
      const arg = args[i].replace(/^\s+|\s+$/g, '')
      if (arg) {
        matches.push(arg)
      }
    }
  }

  return matches
}

export function instantiate (Constructor, args = []) {
  return new Constructor(...args)
}
