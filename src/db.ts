// // lib/db.ts

// import mongoose from "mongoose";
// import dotenv from "dotenv"

//   dotenv.config({path: './.env',});

// const MONGODB_URL = process.env.MONGODB_URL!;

// if (!MONGODB_URL) {
//   throw new Error("Please define MONGODB_URL in env variables");
// }

// // 👇 Global cache (prevents multiple connections in dev / hot reload)
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = {
//     conn: null,
//     promise: null,
//   };
// }

// export async function ConnectToDatabase() {
//   try {
//     // ✅ If already connected → reuse connection
//     if (cached.conn) {
//       return cached.conn;
//     }

//     // ✅ If connection is in progress → wait for it
//     if (!cached.promise) {
//       cached.promise = mongoose.connect(MONGODB_URL, {
//         maxPoolSize: 10, // ✅ control concurrent connections
//         bufferCommands: false, // ✅ fail fast instead of buffering
//         serverSelectionTimeoutMS: 5000, // ✅ fail in 5s if DB unreachable
//       });
//     }

//     cached.conn = await cached.promise;

//     return cached.conn;
//   } catch (error: any) {
//     console.error("❌ MongoDB connection error:", error?.message);

//     // ❗ IMPORTANT: reset promise so next request can retry
//     cached.promise = null;

//     // 👉 Option 1 (recommended for backend APIs)
//     throw error;

//     // 👉 Option 2 (use this if you want NO crashes anywhere)
//     // return null;
//   }
// }

// lib/db.ts - Full improved version
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in env variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function ConnectToDatabase(retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000;

  try {
    if (cached.conn && mongoose.connection.readyState === 1) {
      console.log("✅ Using existing MongoDB connection");
      return cached.conn;
    }

    if (!cached.promise) {
      console.log("🔄 Creating new MongoDB connection...");
      
      cached.promise = mongoose.connect(MONGODB_URL, {
        maxPoolSize: 10,
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        retryReads: true,
      });
    }

    cached.conn = await cached.promise;
    
    // Monitor connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cached.conn = null;
      cached.promise = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cached.conn = null;
      cached.promise = null;
    });
    
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
    
  } catch (error: any) {
    console.error(`❌ MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error?.message);
    
    cached.promise = null;
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return ConnectToDatabase(retryCount + 1);
    }
    
    throw error;
  }
}

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected through app termination');
  }
  process.exit(0);
});