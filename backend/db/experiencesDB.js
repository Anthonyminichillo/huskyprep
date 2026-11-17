import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";
import { containsText } from "./queryHelpers.js";

function experiences() {
  return getDb().collection("interview_experiences");
}

export async function createIndexes() {
  await experiences().createIndexes([
    { key: { company: 1 } },
    { key: { roleType: 1, difficulty: 1, outcome: 1 } },
    { key: { createdAt: -1 } },
  ]);
}

function buildFilter({ company, role, roleType, difficulty, outcome, q }) {
  const filter = {};
  if (company) filter.company = containsText(company);
  if (role) filter.role = containsText(role);
  if (roleType) filter.roleType = roleType;
  if (difficulty) filter.difficulty = difficulty;
  if (outcome) filter.outcome = outcome;
  if (q)
    filter.$or = [{ questions: containsText(q) }, { tips: containsText(q) }];
  return filter;
}

export async function listExperiences(query, { skip, limit }) {
  const filter = buildFilter(query);
  const [items, total] = await Promise.all([
    experiences()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    experiences().countDocuments(filter),
  ]);
  return { items, total };
}

export async function createExperience(data, user) {
  const now = new Date();
  const doc = {
    ...data,
    authorId: user._id,
    authorName: user.username,
    createdAt: now,
    updatedAt: now,
  };
  const result = await experiences().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

// Only the author can change or remove a post, so the author id is part of every filter.
export async function updateExperience(id, data, userId) {
  return experiences().findOneAndUpdate(
    { _id: new ObjectId(id), authorId: userId },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteExperience(id, userId) {
  const result = await experiences().deleteOne({
    _id: new ObjectId(id),
    authorId: userId,
  });
  return result.deletedCount === 1;
}

export async function replaceAllExperiences(docs) {
  await experiences().deleteMany({});
  return experiences().insertMany(docs);
}
