import { Provider } from '../../container/provider'
import logger from 'koa-logger'

class LogProvider extends Provider {
  register () {
    this.instance('log', new Log).asWeak()
  }
}

class Log {
  middleware (...args) {
    return logger.apply(logger, args)
  }
}

module.exports = LogProvider
