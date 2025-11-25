import mongoose from "mongoose";

const MongoDB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose,
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = {conn: null, promise: null};
}

export const connectDB = async () => {
    if (!MongoDB_URI) throw new Error("MongoDB URI must be set within .env");

    if(cached.conn) return cached.conn

    if(!cached.promise) {
        cached.promise = mongoose.connect(MongoDB_URI, { bufferCommands: false});
    }

    try {
        cached.conn = await cached.promise;
    }
    catch(err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to DB ${process.env.NODE_ENV} - ${MongoDB_URI}`);
}