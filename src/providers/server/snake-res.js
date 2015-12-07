import { snakeCaseDeep } from '../../helpers'

export default function () {
  return function * (next) {
    yield next

    if (this.response.is('json')) {
      this.body = snakeCaseDeep(this.body)
    }
  }
}
