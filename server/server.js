require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { mongoSanitize } = require('./middleware/validation');
const { apiLimiter } = require('./middleware/rateLimiter');

const feedbackRoutes = require('./routes/feedbackRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ Security Middleware ============
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize); // Data sanitization against NoSQL injection
app.use(apiLimiter); // Global rate limiting

// ============ CORS Configuration ============
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ============ Body Parser Middleware ============
app.use(express.json({ limit: '10mb' })); // Limit payload size for fairness
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============ Request Logging Middleware ============
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============ Database Connection ============
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not set. Database features will be limited.');
}

// ============ Routes ============
app.use('/api/health', healthRoutes);
app.use('/api/feedback', feedbackRoutes);

// ============ Root Endpoint ============
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Fairness & Anti-Abuse App API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      feedback: '/api/feedback'
    }
  });
});

// ============ Error Handling Middleware ============
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  console.error(`[ERROR] ${status}: ${message}`);
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============ 404 Handler ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ============ Server Startup ============
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;
