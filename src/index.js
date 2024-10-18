import express from 'express';
import morgan from 'morgan'; 
import users from './routes/users.js';
import accounts from './routes/accounts.js';
import { createServer } from 'http';

async function main() {
  const app = express();
  const server = createServer(app);
  
  // Middleware
  app.use(morgan('dev')); 
  app.use(express.json()); 

  // Routes
 app.use("/v1/users", users); 
 app.use("/v1/accounts", accounts);

  // Start the server
  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

main().catch((error) => {
  console.error('Error starting server:', error); 
});
