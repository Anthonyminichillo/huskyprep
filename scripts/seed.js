// Fills the database with synthetic data: 61 users, 1,500 interview
// experiences and 1,200 practice sessions. Replaces existing documents.
// Usage: npm run seed
import bcrypt from "bcrypt";
import {
  COOP_CYCLES,
  DIFFICULTIES,
  INTERVIEW_FORMATS,
  OUTCOMES,
  PRACTICE_TOPICS,
  ROLE_TYPES,
} from "../backend/constants.js";
import { closeDb, connectToDb } from "../backend/db/connection.js";
import { replaceAllExperiences } from "../backend/db/experiencesDB.js";
import { replaceAllSessions } from "../backend/db/sessionsDB.js";
import { replaceAllUsers } from "../backend/db/usersDB.js";

const EXPERIENCE_COUNT = 1500;
const SESSION_COUNT = 1200;
const DEMO_SESSION_COUNT = 300;
const DEMO_USERNAME = "demo";
const DEMO_PASSWORD = "huskyprep-demo";

// Seeded random generator so every run produces the same data.
let seed = 5610;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (min, max) => min + Math.floor(random() * (max - min + 1));
const daysAgo = (days) => new Date(Date.now() - days * 86400000);

const COMPANIES = [
  "Wayfair",
  "HubSpot",
  "Fidelity Investments",
  "State Street",
  "MathWorks",
  "Liberty Mutual",
  "Amazon",
  "Moderna",
  "Draper",
  "Bose",
  "iRobot",
  "Klaviyo",
  "DraftKings",
  "Toast",
  "CarGurus",
  "Boston Scientific",
  "RTX",
  "Takeda",
  "Vertex Pharmaceuticals",
  "Akamai",
  "Dell Technologies",
  "Microsoft",
  "MassMutual",
  "John Hancock",
  "Putnam Investments",
];

const ROLES_BY_TYPE = {
  "software engineering": [
    "Software Engineer Co-op",
    "Backend Developer Co-op",
    "Full Stack Developer Co-op",
  ],
  "data science": [
    "Data Science Co-op",
    "Data Analyst Co-op",
    "Business Intelligence Co-op",
  ],
  "machine learning": ["Machine Learning Engineer Co-op", "AI Research Co-op"],
  "product management": ["Product Management Co-op", "Technical Product Co-op"],
  design: ["UX Design Co-op", "Product Design Co-op"],
  hardware: ["Hardware Engineering Co-op", "Embedded Systems Co-op"],
  business: ["Business Analyst Co-op", "Strategy Co-op"],
  research: ["Research Assistant Co-op", "Lab Research Co-op"],
};

const QUESTIONS_BY_TYPE = {
  "software engineering": [
    "Reverse a linked list in place.",
    "Design a URL shortener.",
    "Find the first non-repeating character in a string.",
    "Explain the difference between a process and a thread.",
    "Merge overlapping intervals.",
    "How would you debug a slow API endpoint?",
  ],
  "data science": [
    "Write a SQL query for the top 3 products by revenue per month.",
    "Explain p-values to a non-technical stakeholder.",
    "How would you handle missing data in a survey?",
    "Walk through an A/B test you would design for a checkout page.",
    "What is the difference between precision and recall?",
  ],
  "machine learning": [
    "Explain the bias-variance tradeoff.",
    "How does gradient boosting work?",
    "How would you detect data leakage?",
    "Walk me through a model you deployed.",
    "When would you use a transformer over an RNN?",
  ],
  "product management": [
    "How would you improve our mobile app onboarding?",
    "Prioritize these five features for next quarter.",
    "Tell me about a time you used data to make a decision.",
  ],
  design: [
    "Walk through a project in your portfolio.",
    "Redesign a parking app for accessibility.",
    "How do you run a usability test?",
  ],
  hardware: [
    "Explain how an op-amp works.",
    "Debug a circuit that resets randomly.",
    "What is the difference between I2C and SPI?",
  ],
  business: [
    "Estimate the market size for e-bikes in Boston.",
    "Walk through a pivot table you built.",
    "Tell me about a conflict on a team.",
  ],
  research: [
    "Describe a paper you read recently.",
    "How do you design a controlled experiment?",
    "Tell me about a time an experiment failed.",
  ],
};

const BEHAVIORAL = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "Tell me about a time you failed.",
  "Describe a time you worked under a tight deadline.",
];

const TIPS = [
  "Practice explaining your thought process out loud.",
  "They cared more about communication than the perfect answer.",
  "Review your resume projects in detail; they asked follow-up questions on each.",
  "Ask clarifying questions before you start coding.",
  "The recruiter replied within a week. Send a thank-you note.",
  "Bring questions about the team; they left 10 minutes at the end.",
  "",
];

const SESSION_QUESTIONS = {
  "arrays and strings": [
    "Two sum",
    "Longest substring without repeating characters",
    "Rotate array",
  ],
  "trees and graphs": [
    "Level order traversal",
    "Number of islands",
    "Course schedule",
  ],
  "dynamic programming": [
    "Coin change",
    "Longest increasing subsequence",
    "House robber",
  ],
  "system design": [
    "Design a chat app",
    "Design a rate limiter",
    "Design a news feed",
  ],
  SQL: [
    "Second highest salary",
    "Running totals with window functions",
    "Customers who never ordered",
  ],
  behavioral: [
    "Tell me about a conflict",
    "Biggest failure",
    "Why this company",
  ],
  "object-oriented design": ["Design a parking lot", "Design a library system"],
  "machine learning": [
    "Explain regularization",
    "Overfitting vs underfitting",
    "Feature scaling",
  ],
  statistics: [
    "Central limit theorem",
    "Confidence intervals",
    "Hypothesis testing",
  ],
  frontend: [
    "Event delegation",
    "Debounce a search input",
    "React useEffect cleanup",
  ],
};

const SESSION_NOTES = [
  "Got the brute force quickly but needed a hint for the optimal approach.",
  "Timed myself; finished with 5 minutes to spare.",
  "Need to review edge cases.",
  "Explained it out loud to a friend.",
  "",
];

function makeUsers(sharedHash, demoHash) {
  const now = new Date();
  const users = [
    { username: DEMO_USERNAME, passwordHash: demoHash, createdAt: now },
  ];
  for (let i = 1; i <= 60; i++) {
    users.push({
      username: `husky${String(i).padStart(2, "0")}`,
      passwordHash: sharedHash,
      createdAt: now,
    });
  }
  return users;
}

function makeExperience(author) {
  const roleType = pick(ROLE_TYPES);
  const questions = new Set([pick(BEHAVIORAL)]);
  while (questions.size < between(2, 4))
    questions.add(pick(QUESTIONS_BY_TYPE[roleType]));
  const createdAt = daysAgo(between(0, 540));
  return {
    company: pick(COMPANIES),
    role: pick(ROLES_BY_TYPE[roleType]),
    roleType,
    coopCycle: pick(COOP_CYCLES),
    format: pick(INTERVIEW_FORMATS),
    rounds: between(1, 4),
    difficulty: pick(DIFFICULTIES),
    outcome: pick(OUTCOMES),
    questions: [...questions],
    tips: pick(TIPS),
    authorId: author._id,
    authorName: author.username,
    createdAt,
    updatedAt: createdAt,
  };
}

function makeSession(user) {
  const topic = pick(PRACTICE_TOPICS);
  const practicedOn = daysAgo(between(0, 180));
  return {
    topic,
    question: pick(SESSION_QUESTIONS[topic]),
    minutes: between(10, 90),
    confidence: between(1, 5),
    practicedOn: practicedOn.toISOString().slice(0, 10),
    notes: pick(SESSION_NOTES),
    userId: user._id,
    createdAt: practicedOn,
    updatedAt: practicedOn,
  };
}

await connectToDb();
const [sharedHash, demoHash] = await Promise.all([
  bcrypt.hash(`seed-${Date.now()}-${Math.random()}`, 10),
  bcrypt.hash(DEMO_PASSWORD, 10),
]);
const { insertedIds } = await replaceAllUsers(makeUsers(sharedHash, demoHash));
const users = Object.values(insertedIds).map((_id, i) => ({
  _id,
  username: i === 0 ? DEMO_USERNAME : `husky${String(i).padStart(2, "0")}`,
}));
const others = users.slice(1);

const experiences = Array.from({ length: EXPERIENCE_COUNT }, () =>
  makeExperience(pick(others)),
);
const sessions = [
  ...Array.from({ length: DEMO_SESSION_COUNT }, () => makeSession(users[0])),
  ...Array.from({ length: SESSION_COUNT - DEMO_SESSION_COUNT }, () =>
    makeSession(pick(others)),
  ),
];
await replaceAllExperiences(experiences);
await replaceAllSessions(sessions);

console.log(
  `Seeded ${users.length} users, ${experiences.length} interview experiences and ${sessions.length} practice sessions.`,
);
console.log(`Demo login: ${DEMO_USERNAME} / ${DEMO_PASSWORD}`);
await closeDb();
