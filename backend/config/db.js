import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        mongoose.set('strictQuery', false);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
        
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("⚠️  MongoDB is not running. Please start MongoDB service.");
        console.log("💡 You can start MongoDB with: mongod --dbpath <your-db-path>");
        console.log("💡 Or if using MongoDB Atlas, check your connection string and network access.");
        console.log("💡 For local development, you can also use MongoDB Compass or Docker:");
        console.log("   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest");
        console.log("   - Or install MongoDB Community Server from: https://www.mongodb.com/try/download/community");
        
        // Don't exit the process in development, but log the error
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Exiting process due to MongoDB connection failure in production');
            process.exit(1);
        } else {
            console.log('🔄 Server will continue running without database connection for development');
        }
    }
};
