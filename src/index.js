import express from 'express';
import users from './routes/users.js';
import { createServer } from 'http';

async function main() {
  const app = express();
  const server = createServer(app);
  app.use(express.json());

  users(app);

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

main();