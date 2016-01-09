/**
 * Import dependencies.
 */
import { HttpError } from './errors'

/**
 * Send response.
 * @param  {Mixed} res HttpError instance, object, or string to send.
 * @return {Void}
 */
export function * send (res) {
  // Check if instance of HttpError. If so, extract status, code
  // and message to create response from.
  if (res instanceof HttpError) {
    const { status, code, message } = res
    this.type = 'application/json'
    this.status = status
    this.body = JSON.stringify({ code, message })
  // If is an object, set type to json and stringify it.
  } else if (typeof res === 'object') {
    this.type = 'application/json'
    this.body = JSON.stringify(res)
  // Nothing detected, just pass to body.
  } else {
    this.body = res
  }
}
