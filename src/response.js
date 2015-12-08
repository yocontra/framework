import { HttpError } from './errors'

export const cacheControl  = (maxAge)  => {
  if (maxAge === false) {
    this.set('Cache-Control', 'private, no-cache')
    return this
  }

  if (typeof maxAge === 'number') {
    this.set('Cache-Control', `public, max-age=${Math.round(maxAge / 1000)}`)
    return this
  }

  if (typeof maxAge === 'string') {
    this.set('Cache-Control', maxAge)
    return this
  }

  throw new Error(`invalid cache control value: ${maxAge}`)
}

export const cc = cacheControl

export function * send (response) {
  if (response instanceof HttpError) {
    const { status, code, message } = response
    this.status = status
    this.body = { code, message }
  } else {
    this.body = response
  }
}
