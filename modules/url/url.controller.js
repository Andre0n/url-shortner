import { IncomingMessage, ServerResponse } from 'node:http';
import { url_service } from './url.module.js';
import { send_response } from '../../utils/response.js';

export class UrlController {
  /**
   * Shortens a URL.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   */
  static shorten(request, response) {
    const { long_url } = request.body;

    const shortened_url = url_service.shorten(long_url);

    if (!shortened_url) {
      return send_response(response, {
        status: 500,
        error: {
          message: 'The URL could not be shortened.',
        },
      });
    }

    return send_response(response, { status: 201, data: shortened_url });
  }
}