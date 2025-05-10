import 'newrelic'; // This line must be at the very top of your app

// express
import express from 'express';

// cookie parser
import cookieParser from 'cookie-parser';

// dotenv
import { config } from 'dotenv';

// db
import connectDB from './config/db.js';

// middlewares
import { authenticated } from './middleware/auth.js';
import errorMiddleware from './middleware/error.js';
import sanitizeMiddleware from './middleware/sanitize.js';

// routes
import mainRoutes from './api/index.js';
import publicRoutes from './api/public.js';

// security
import cors from 'cors';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// socket.io
import setupSocket from './config/socket.js';

// http
import http from 'http';

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

const csrfProtection = csurf({ cookie: true });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const server = http.createServer(app);
const corsOptions = {
  origin: process.env.URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const Csurf = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    csrfProtection(req, res, next);
  } else {
    next();
  }
};

// middlewares
app.use(cors(corsOptions));
//app.use(Csurf);
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeMiddleware);

// routes
app.use('/api/protected', authenticated, mainRoutes);
app.use('/api/public', publicRoutes);

setupSocket(server);

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
