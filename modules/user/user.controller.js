import { send_response } from '../../utils/response.js';
import { user_service } from './user.module.js';

const errors_messages = ['Username already exists', 'Email already exists'];

export class UserController {
  /**
   *
   * @param {import('node:http').IncomingMessage} request
   * @param {import('node:http').ServerResponse} response
   * @returns
   */
  static async create(request, response) {
    const { username, email, password } = request.body;
    try {
      const user = user_service.create({ username, email, password });

      if (!user) {
        return send_response(response, {
          status: 500,
          error: {
            message: 'The user could not be registered.',
          },
        });
      }

      return send_response(response, { status: 201, data: user });
    } catch (error) {
      const message = errors_messages.includes(error.message)
        ? error.message
        : 'The user could not be registered.';

      return send_response(response, {
        status: 500,
        data: {
          error: {
            message,
          },
        },
      });
    }
  }
}
