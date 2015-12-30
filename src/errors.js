export class RuntimeError extends Error {
  get name () {
    return this.constructor.name
  }
  constructor (message = 'A runtime error occorred', code = 'RUNTIME_ERROR', status = 500) {
    super(message)
    this.code = code
    this.status = status
    this.stack = this.stack.split('\n')
      .filter((line) => !line.match(/(^\s{4,})(.+)(errors\.js)/))
      .join('\n')
  }
}

export class HttpError extends RuntimeError {

  constructor (message, code = 'HTTP_ERROR', status = 400) {
    super(message, code, status)
  }
}

export class PageNotFoundError extends HttpError {
  constructor(message = 'Page Not Found', code = 'PAGE_NOT_FOUND') {
    super(message, code, 404)
  }
}

export class ResourceNotFoundError extends HttpError {
  constructor (message = 'Resource Not Found', code = 'RESOURCE_NOT_FOUND') {
    super(message, code, 404)
  }
}
