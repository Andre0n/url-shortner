import { json_body } from './utils/json_body.js';
import { send_response } from './utils/response.js';
import { Router } from './utils/router.js';

const router = new Router();

router.use_middleware(json_body);

router.get('/', (_req, res) => {
  send_response(res, { data: { message: 'Hello World!' } });
});

export default router;
