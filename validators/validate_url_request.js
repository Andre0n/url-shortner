import { send_response } from '../utils/response.js';

/**
 * Middleware to validate the request URL
 * @param {Function} handler the handler function to validate
 * @returns {Function} the middleware function
 */
const validate_url_request = (handler) => {
  /**
   * Middleware to validate the request URL
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {void}
   */
  const validate = (request, response) => {
    const { long_url, tags, expires, custom, visible } = request.body;
    const erros = [];
    const add_error = (message) => erros.push({ message });

    if (!long_url) {
      add_error('long_url is required');
    } else {
      try {
        new URL(long_url);
      } catch (error) {
        add_error('long_url must be a valid URL');
      }
    }

    if (custom && typeof custom !== 'string')
      add_error('custom must be a string');

    if (tags && !Array.isArray(tags)) add_error('tags must be an array');

    if (expires) {
      const iso_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
      if (!iso_regex.test(expires))
        add_error('expires must be a valid ISO date');
      else if (new Date(expires) < new Date())
        add_error('expires must be a future date');
      else request.body.expires = new Date(expires);
    }

    if (visible) {
      if (visible !== 'true' && visible !== 'false') {
        add_error('visible must be a boolean');
      } else request.body.visible = visible === 'true';
    }

    if (erros.length) {
      return send_response(response, { status: 400, data: { errors: erros } });
    }

    return handler(request, response);
  };

  return validate;
};

export default validate_url_request;
