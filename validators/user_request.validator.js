import { send_response } from '../utils/response.js';

/**
 * Validate user request
 *
 * @param {Function} handler the handler function to validate
 * @returns {Function} the middleware function
 */
export const validate_user_request = (handler) => {
  /**
   * Middleware to validate the request URL
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {void}
   */
  const validate = (request, response) => {
    const { username, email, password } = request.body;
    const errors = [];
    const add_error = (message) => errors.push({ message });

    if (!username) {
      add_error('username is required');
    }

    if (!email) {
      add_error('email is required');
    }

    if (!password) {
      add_error('password is required');
    }

    if (username) {
      if (typeof username !== 'string') {
        add_error('username must be a string');
      }
      if (username.length < 6) {
        add_error('username must be at least 6 characters long');
      }
      if (username.length > 20) {
        add_error('username must be at most 20 characters long');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        add_error(
          'username must contain only letters, numbers and underscores',
        );
      }
    }

    if (email) {
      if (typeof email !== 'string') {
        add_error('email must be a string');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        add_error('email must be a valid email address');
      }
      if (email.length > 50) {
        add_error('email must be at most 50 characters long');
      }
    }

    if (password) {
      if (typeof password !== 'string') {
        add_error('password must be a string');
      }
      if (password.length < 8) {
        add_error('password must be at least 8 characters long');
      }
      if (password.length > 50) {
        add_error('password must be at most 50 characters long');
      }
    }

    if (errors.length) {
      return send_response(response, { status: 400, data: { errors: errors } });
    }

    return handler(request, response);
  };

  return validate;
};
