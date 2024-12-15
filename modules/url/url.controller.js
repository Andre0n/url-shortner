import { IncomingMessage, ServerResponse } from 'node:http';
import { send_response } from '../../utils/response.js';
import { url_service } from './url.module.js';

export class UrlController {
  /**
   * Shortens a URL.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   */
  static shorten(request, response) {
    const { long_url, expires, visible } = request.body;

    const shortened_url = url_service.shorten(long_url, expires, visible);

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

  /**
   * Redirects to the original URL.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   */
  static redirect(request, response) {
    const { short_url } = request.params;

    const original_url = url_service.getOriginalUrl(short_url);
    if (!original_url) {
      return send_response(response, {
        status: 404,
        data: {
          error: {
            message: 'The URL could not be found.',
          },
        },
      });
    }

    return response.writeHead(301, { Location: original_url }).end();
  }
}
