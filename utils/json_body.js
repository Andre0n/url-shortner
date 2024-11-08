/**
 * This middleware should parse the body of the request as JSON.
 * @param {Function} handler the handler function to parse the body
 */
import { send_response } from './response.js';

export const json_body = (handler) => {
  return (request, response) => {
    const body = [];
    request
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        try {
          if (body.length === 0) {
            request.body = {};
            return handler(request, response);
          }
          const data = Buffer.concat(body).toString();
          request.body = JSON.parse(data);
          handler(request, response);
        } catch (error) {
          console.error(error);
          send_response(response, {
            status: 400,
            data: { message: 'invalid JSON format' },
          });
        }
      });
  };
};
