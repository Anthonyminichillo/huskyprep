import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";
import { containsText } from "./queryHelpers.js";

function sessions() {
  return getDb().collection("practice_sessions");
}

export async function createIndexes() {
  await sessions().createIndexes([
    { key: { userId: 1, practicedOn: -1 } },
    { key: { userId: 1, topic: 1, confidence: 1 } },
  ]);
}

// Practice sessions are private, so every query is scoped to the signed-in user.
function buildFilter(userId, { topic, confidence, q }) {
  const filter = { userId };
  if (topic) filter.topic = topic;
  if (confidence) filter.confidence = Number(confidence);
  if (q)
    filter.$or = [{ question: containsText(q) }, { notes: containsText(q) }];
  return filter;
}

export async function listSessions(userId, query, { skip, limit }) {
  const filter = buildFilter(userId, query);
  const [items, total, summary] = await Promise.all([
    sessions()
      .find(filter)
      .sort({ practicedOn: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    sessions().countDocuments(filter),
    sessions()
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$topic",
            count: { $sum: 1 },
            avgConfidence: { $avg: "$confidence" },
            minutes: { $sum: "$minutes" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
  ]);
  return { items, total, summary };
}

export async function createSession(data, userId) {
  const now = new Date();
  const doc = { ...data, userId, createdAt: now, updatedAt: now };
  const result = await sessions().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function updateSession(id, data, userId) {
  return sessions().findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteSession(id, userId) {
  const result = await sessions().deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount === 1;
}

export async function replaceAllSessions(docs) {
  await sessions().deleteMany({});
  return sessions().insertMany(docs);
}
