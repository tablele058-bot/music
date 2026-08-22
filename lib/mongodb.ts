import dns from "dns";
// Fix for ISP blocking SRV queries — use Google + Cloudflare
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {}

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not set");
}

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "music";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  if (client) return Promise.resolve(client);
  if (clientPromise) return clientPromise;
  clientPromise = new MongoClient(uri, { appName: "music-next" }).connect().then((c) => {
    client = c;
    return c;
  });
  return clientPromise;
}

export async function getDb() {
  const c = await getClient();
  return c.db(dbName);
}

export async function pingMongo() {
  const c = await getClient();
  await c.db("admin").command({ ping: 1 });
  return true;
}
