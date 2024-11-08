import { json_body } from "./utils/json_body.js";
import { send_response } from "./utils/response.js";
import { Router } from "./utils/router.js";

import validate_url_request from "./validators/validate_url_request.js";

const router = new Router();

router.use_middleware(json_body);

router.get("/", (_req, res) => {
	send_response(res, { data: { message: "Hello World!" } });
});

router.put(
	"/url",
	validate_url_request((_request, response) => {
		send_response(response, { data: { message: "URL created" } });
	}),
);

export default router;
