import { Provider } from '../../container/provider'
import KoaRouter from 'koa-router'

class RouterProvider extends Provider {
  register () {
    this.instance('router', new Router).asWeak()
  }
}

class Router extends KoaRouter {
  controller (path, controller) {
    // TODO: Translate a path and controller string to a working
    // controller instance and attach to router.
  }

  resource (path, controller) {
    // TODO: Same as `controller` just for resource based controllers.
  }
}

module.exports = RouterProvider
