import { json_body } from './utils/json_body.js';
import { send_response } from './utils/response.js';
import { Router } from './utils/router.js';
import { UrlModel } from './models/url.model.js';

import validate_url_request from './validators/validate_url_request.js';

const router = new Router();

router.use_middleware(json_body);

router.get('/', (_req, res) => {
  send_response(res, { data: { message: 'Hello World!' } });
});

router.put(
  '/url',
  validate_url_request((_request, response) => {
    const { long_url } = _request.body;
    const exists = UrlModel.find_by_long_url(long_url);

    if (exists) {
      return send_response(response, {
        status: 400,
        data: {
          long_url: exists.long_url,
          short_url: exists.short_url,
          is_active: Boolean(exists.is_active),
          created_at: exists.created_at,
        },
      });
    }

    const short_url = Math.random().toString(36).substring(2, 8);
    const url = UrlModel.save({
      long_url,
      short_url,
    });

    send_response(response, {
      data: {
        long_url: url.long_url,
        short_url: url.short_url,
        is_active: Boolean(url.is_active),
        created_at: url.created_at,
      },
    });
  }),
);

export default router;
