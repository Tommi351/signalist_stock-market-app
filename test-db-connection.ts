import dotenv from 'dotenv';
dotenv.config(); // <-- loads .env before anything else
import { connectDB } from './mongoose';
import mongoose from 'mongoose';

async function testConnection() {
    console.log('🔄 Testing database connection...\n');

    try {
        // Connect to DB
        await connectDB();

        console.log('✅ Database connected successfully!');
        console.log('📊 Connection state:', mongoose.connection.readyState);
        console.log('🗄️  Database name:', mongoose.connection.name);
        console.log('🌐 Connection string:', process.env.MONGODB_URL);

        // Test DB operations
        const db = mongoose.connection.db;
        if (!db) throw new Error('Database connection not ready');

        const collections = await db.listCollections().toArray();
        console.log(`✅ Found ${collections.length} collection(s) in database`);

        if (collections.length > 0) {
            console.log('📁 Collections:', collections.map(c => c.name).join(', '));
        }

        // Close connection (optional for testing)
        await mongoose.connection.close();
        console.log('\n✅ Connection closed successfully');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error);
        process.exit(1);
    }
}

// Properly handle top-level async Promise
testConnection().catch(err => console.error('Unhandled error:', err));