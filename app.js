// app.js
import express, { urlencoded } from 'express';
import connectDB from './Connection/connectDB.js';
import urlRoutes from './Routes/urlRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

// Routes
// app.use('/api/url', urlRoutes);
app.use('/', urlRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

start();

