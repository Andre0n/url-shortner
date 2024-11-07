import { send_response } from "./utils/response.js";
import { Router } from "./utils/router.js";

const router = new Router();

router.get("/", (_req, res) => {
  send_response(res, { data: { message: "Hello World!" } });
});

router.get("/url/:id", (_req, res) => {
  send_response(res, { data: { id: _req.params.id } });
});

export default router;
