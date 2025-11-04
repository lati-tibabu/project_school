const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, syncDatabase } = require('./config/database');
const moduleLoader = require('./config/moduleLoader');

// Import core routes
const authRoutes = require('./core/routes/auth');
const campusRoutes = require('./core/routes/campus');
const dashboardRoutes = require('./core/routes/dashboard');

// Initialize models (to set up associations)
require('./core/models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Core API routes
app.use('/api/auth', authRoutes);
app.use('/api/campus', campusRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Initialize server
const startServer = async () => {
  try {
    console.log('🚀 Starting School Management System...');
    
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Sync database
    await syncDatabase({ alter: process.env.NODE_ENV === 'development' });

    // Load modules
    await moduleLoader.loadModules();

    // Register module routes
    moduleLoader.registerRoutes(app);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
