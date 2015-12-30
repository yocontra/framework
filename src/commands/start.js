import { resolve } from 'path'
import Command from '../command'

export default class Start extends Command {
  get blocking () {
    return true
  }

  get description () {
    return 'start the application'
  }

  action () {
    return require(resolve(this.config('paths.app'), '..', 'bootstrap/http'))
    .then(function boot (app) {
      require('http').createServer(app.bootstrap())
      .listen(app.config('app.port'), app.config('app.hostname'), () => {
        console.log(
          '%s started on http://%s:%s/ in %s mode.',
          app.config('app.name'),
          app.config('app.hostname'),
          app.config('app.port'),
          app.env()
        )
      })
    })
    .catch((err) => console.error(err.stack))
  }
}
