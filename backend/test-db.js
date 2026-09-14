require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');

const mongoose = require('mongoose');

const testConnection = async () => {
      try {
            console.log('Connecting to MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI);

            console.log('✅ MongoDB Connected Successfully!\n');
            console.log('Database:', mongoose.connection.db.databaseName);
            console.log('Host:', mongoose.connection.host);
            console.log('\n🎉 Connection test passed!');

            process.exit(0);
      } catch (error) {
            console.error('❌ MongoDB Connection Failed:');
            console.error(error.message);
            process.exit(1);
      }
};

testConnection();
