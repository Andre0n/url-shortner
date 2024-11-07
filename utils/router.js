import { send_response } from './response.js';

/**
 * Router class
 * @class Router
 * @example const router = new Router();
 */
class Router {
  #routes = {};

  /**
   * Get all routes
   * @returns {object} - All routes
   * @example router.getRoutes();
   */
  getRoutes() {
    return this.#routes;
  }

  /**
   * Add a new route to the router
   * @param {string} path - The path of the route
   * @param {function} callback - The callback function of the route
   * @returns {void}
   * @example router.get('/path', (req, res) => { res.send('Hello World!'); });
   */
  get(path, callback) {
    if (!this.#routes[path]) {
      this.#routes[path] = {};
    }
    this.#routes[path].GET = callback;
  }

  /**
   * Add a new route to the router
   * @param {string} path - The path of the route
   * @param {function} callback - The callback function of the route
   * @returns {void}
   * @example router.put('/path', (req, res) => { res.send('Hello World!'); });
   */
  put(path, callback) {
    if (!this.#routes[path]) {
      this.#routes[path] = {};
    }
    this.#routes[path].PUT = callback;
  }

  /**
   * Add a new router to the router
   * @param {Router} router - The path of the route
   */
  use(router) {
    this.#routes = { ...this.#routes, ...router.getRoutes() };
  }

  handle_request(req, res) {
    const { url: request_url, method: request_method } = req;
    const parsed_url = new URL(
      `http://${process.env.HOST ?? 'localhost'}${request_url}`,
    );
    const { pathname: path } = parsed_url;
    const method = request_method.toUpperCase();

    let handler = this.#routes[path]?.[method];

    if (!handler) {
      const routes = Object.keys(this.#routes).filter((route) =>
        route.includes(':'),
      );

      const matched_route = routes.find((route) => {
        const regex = new RegExp(`^${route.replace(/:[^/]+/g, '([^/]+)')}$`);
        return regex.test(path);
      });

      if (matched_route) {
        const regex_test = new RegExp(
          `^${matched_route.replace(/:[^/]+/g, '([^/]+)')}$`,
        );
        const url_params = path.match(regex_test).slice(1);
        const route_handler = this.#routes[matched_route][method];

        const params_names = matched_route
          .match(/:[^/]+/g)
          .map((param) => param.slice(1));

        const params = {};
        for (const [index, name] of params_names.entries()) {
          params[name] = url_params[index];
        }

        req.params = params;
        handler = route_handler;
      }
    }

    if (!handler) {
      handler = (_req, res) => {
        send_response(res, {
          data: `Cannot ${method} ${path}`,
          status: 404,
          contentType: 'text/plain',
        });
      };
    }

    handler(req, res);
  }
}

export { Router };
