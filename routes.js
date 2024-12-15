import { UrlController } from './modules/url/url.controller.js';
import { UserController } from './modules/user/user.controller.js';
import { json_body } from './utils/json_body.js';
import { send_response } from './utils/response.js';
import { Router } from './utils/router.js';
import { validate_user_request } from './validators/user_request.validator.js';
import validate_url from './validators/validate_url_request.js';

const router = new Router();

router.use_middleware(json_body);

router.get('/', (_req, res) => {
  send_response(res, { data: { message: 'Hello World!' } });
});

router.put('/url', validate_url(UrlController.shorten));
router.get('/:short_url', UrlController.redirect);
router.post('/users', validate_user_request(UserController.create));

export default router;
