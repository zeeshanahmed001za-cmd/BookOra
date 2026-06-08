const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');

const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/middlewares/errorMiddleware');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
const cleanObj = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        cleanObj(obj[key]);
      }
    }
  }
};
app.use((req, res, next) => {
  cleanObj(req.body);
  cleanObj(req.query);
  cleanObj(req.params);
  next();
});

// Data sanitization against XSS
const cleanXSS = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<[^>]*>/g, '');
      } else if (typeof obj[key] === 'object') {
        cleanXSS(obj[key]);
      }
    }
  }
};
app.use((req, res, next) => {
  cleanXSS(req.body);
  cleanXSS(req.query);
  cleanXSS(req.params);
  next();
});

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'ratingsAverage', 'category']
}));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
const bookRouter = require('./src/routes/bookRoutes');
const userRouter = require('./src/routes/userRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');
const orderRouter = require('./src/routes/orderRoutes');

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Bookora API'
  });
});

// Handle unhandled routes
app.all('*path', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
