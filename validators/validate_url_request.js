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
    // Assumes that the request body is already parsed as JSON
    const { long_url, tags, expire, custom } = request.body;

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
    if (expire && typeof expire !== 'number')
      add_error('expire must be a number');

    if (erros.length) {
      return send_response(response, { status: 400, data: { errors: erros } });
    }

    return handler(request, response);
  };

  return validate;
};

export default validate_url_request;
