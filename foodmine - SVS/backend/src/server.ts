// Importing necessary modules and configurations
import dotenv from 'dotenv';
dotenv.config(); // Loads environment variables from a .env file into process.env

import express from 'express';
import cors from 'cors';
import orderRouter from './routers/order.router';
import foodRouter from './routers/food.router';
import userRouter from './routers/user.router';
import { dbConnect } from './configs/database.config';

// Connecting to the MongoDB database
dbConnect();

// Creating an Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);

// Routing setup
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Setting up the server to listen on port 5000
const port = 5000;
app.listen(port, () => {
  console.log('Listening to http://localhost:' + port);
});
