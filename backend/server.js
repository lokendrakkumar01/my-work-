require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const socialRoutes = require('./routes/social');
const youtubeRoutes = require('./routes/youtube');
const taskRoutes = require('./routes/tasks');
const habitRoutes = require('./routes/habits');
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');
const fileRoutes = require('./routes/files');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// ===================================
// SECURITY MIDDLEWARE
// ===================================
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ===================================
// CORS CONFIGURATION
// ===================================
const allowedOrigins = [
  'http://localhost:3000',
  'https://creator-hub-un8y.onrender.com', // Explicitly allow frontend
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
];

console.log('✅ Allowed CORS Origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked Origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ===================================
// BODY PARSING
// ===================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// STATIC FILES
// ===================================
app.use('/uploads', express.static('uploads'));

// ===================================
// MONGODB CONNECTION
// ===================================
// Connection Status Tracker
let dbStatus = {
  status: 'disconnected',
  lastError: null
};

if (process.env.SKIP_DB_CONNECTION !== 'true' && process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      dbStatus.status = 'connected';
      dbStatus.lastError = null;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      dbStatus.status = 'error';
      dbStatus.lastError = err.message;
      console.warn('⚠️  Running in NO-DATABASE mode. Some features will not work.');
    });
} else {
  console.warn('⚠️  MongoDB connection skipped (SKIP_DB_CONNECTION=true or no MONGODB_URI)');
  dbStatus.status = 'skipped';
}

// ... (routes)

// ===================================
// HEALTH CHECK
// ===================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// ===================================
// ROOT ENDPOINT
// ===================================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Creator Control Hub API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    database_status: dbStatus.status
  });
});

// ===================================
// ERROR HANDLING
// ===================================
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===================================
// SERVER START
// ===================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
