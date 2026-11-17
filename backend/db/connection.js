import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToDb() {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env.");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.DB_NAME || "huskyprep");
  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not connected. Call connectToDb first.");
  return db;
}

export function getClient() {
  if (!client)
    throw new Error("Database not connected. Call connectToDb first.");
  return client;
}

export async function closeDb() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}
