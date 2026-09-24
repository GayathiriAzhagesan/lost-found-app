const mongoose = require('mongoose');
const dns = require('dns');

// Helper to mask sensitive credentials in logs
const maskMongoUri = (uri) => {
  if (!uri) return 'undefined';
  return uri.replace(/:([^:@]+)@/, ':****@');
};

/**
 * Configure DNS fallback for SRV resolution
 * Resolves Windows ISP DNS issues (querySrv ECONNREFUSED) with Atlas mongodb+srv:// URIs
 */
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // If setting custom DNS servers is not permitted in the environment, continue with system defaults
}

/**
 * Connect to MongoDB Atlas using Mongoose
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI environment variable is missing.');
    console.error('💡 Please specify a valid MongoDB connection string in your .env file.');
    process.exit(1);
  }

  const dbName = process.env.DB_NAME || 'lost_found';

  try {
    const conn = await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);

    // Seed default demo data if database is empty
    await seedInitialData();

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`Target: ${maskMongoUri(uri)}`);
    console.error(`Error details: ${error.message}`);
    console.error('\n💡 Troubleshooting checklist:');
    console.error('  1. Check that your MongoDB Atlas Network Access whitelist includes your current IP (or 0.0.0.0/0).');
    console.error('  2. Verify your MongoDB database username and password in process.env.MONGO_URI.');
    console.error('  3. Verify that your cluster is active and accepting connections.\n');
    process.exit(1);
  }
};

/**
 * Seed initial demo accounts and items if database collections are empty
 */
const seedInitialData = async () => {
  try {
    const User = require('../models/User');
    const Item = require('../models/Item');
    const mockStore = require('../data/mockStore');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial campus demo accounts into MongoDB...');
      await User.insertMany(mockStore.users);
      console.log(`✨ Seeded ${mockStore.users.length} demo user accounts (Admin: admin@campus.edu, Student: student@campus.edu)`);
    }

    const itemCount = await Item.countDocuments();
    if (itemCount === 0) {
      console.log('🌱 Seeding initial sample items into MongoDB...');
      await Item.insertMany(mockStore.items);
      console.log(`✨ Seeded ${mockStore.items.length} sample Lost & Found items`);
    }
  } catch (seedErr) {
    console.warn('⚠️ Seeding notice:', seedErr.message);
  }
};

module.exports = connectDB;
