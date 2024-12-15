import { send_response } from '../utils/response.js';

export const handle_error = (handler) => {
  /**
   * Middleware to handle errors
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {void}
   */
  const handle = (request, response) => {
    try {
      return handler(request, response);
    } catch (error) {
      console.error(error);
      send_response(response, {
        status: 500,
        data: {
          error: {
            message: 'Internal Server Error',
          },
        },
      });
    }
  };

  return handle;
};
