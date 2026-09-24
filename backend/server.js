const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables immediately
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'online',
    platform: 'Lost & Found Campus Item Recovery Platform',
    version: '1.0.0 (MongoDB Atlas)',
    timestamp: new Date().toISOString(),
    databaseMode: isConnected ? 'MongoDB' : 'Disconnected',
    databaseName: isConnected ? mongoose.connection.name : null,
    uptime: Math.floor(process.uptime()),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Render and production environment port
const PORT = process.env.PORT || 5000;

/**
 * Start Server after establishing database connection
 */
const startServer = async () => {
  try {
    // Establish MongoDB connection first
    await connectDB();

    return new Promise((resolve) => {
      const server = app.listen(PORT, () => {
        console.log(`🚀 Lost & Found Backend Server running on http://localhost:${PORT}`);
        console.log(`📋 Health check available at: http://localhost:${PORT}/api/health`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error('Fatal Server Startup Error:', error.message);
    process.exit(1);
  }
};

// Start automatically when run directly via "node server.js"
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
