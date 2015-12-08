import KoaRouter from 'koa-router'

export class Router extends KoaRouter {
  controller (path, controller) {
    // TODO: Translate a path and controller string to a working
    // controller instance and attach to router.
  }

  resource (path, controller) {
    // TODO: Same as `controller` just for resource based controllers.
  }
}
