export class KratosError extends Error {
  constructor (message) {
    super(message)
    const stack = []
    this.stack.split('\n').map((line, i) => {
      if(!line.match(/(^\s{4,})(.+)(dist\/errors\.js)/)) {
        stack.push(line)
      }
    })
    this.stack = stack.join('\n')
  }
}

export class HttpError extends KratosError {
  constructor (message, code = 'NOT_FOUND', status = 404) {
    super(message)
    this.code = code
    this.status = status
  }
}

export class ResourceNotFoundError extends HttpError {
  constructor () {
    super('Resource Not Found', 'RESOURCE_NOT_FOUND')
  }
}
