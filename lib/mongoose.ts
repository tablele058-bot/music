import dns from "dns";
try { dns.setServers(["8.8.8.8","1.1.1.1"]); } catch {}
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error("MONGODB_URI not set");

let cached = (global as unknown as { _mongooseCache?: Promise<typeof mongoose> })._mongooseCache;

export async function connectMongoose() {
  if (mongoose.connection.readyState >= 1) return mongoose;
  if (!cached) {
    cached = mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "music" }).then(m => m);
    (global as unknown as { _mongooseCache?: Promise<typeof mongoose> })._mongooseCache = cached;
  }
  return cached;
}
