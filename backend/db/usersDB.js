import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";

function users() {
  return getDb().collection("users");
}

export async function createIndexes() {
  await users().createIndex({ username: 1 }, { unique: true });
}

export async function findUserByUsername(username) {
  return users().findOne({ username: username.toLowerCase() });
}

export async function findUserById(id) {
  return users().findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } },
  );
}

export async function createUser(username, passwordHash) {
  const doc = {
    username: username.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  };
  const result = await users().insertOne(doc);
  return { _id: result.insertedId, username: doc.username };
}

export async function replaceAllUsers(docs) {
  await users().deleteMany({});
  return users().insertMany(docs);
}
