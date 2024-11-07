import { createServer } from 'node:http';
import router from './routes.js';

const server = createServer();
const PORT = process.env.PORT || 3000;

server.on('request', (_req, res) => {
  router.handle_request(_req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
