import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import passport from "./backend/auth/passport.js";
import { connectToDb, getClient } from "./backend/db/connection.js";
import { createIndexes as createExperienceIndexes } from "./backend/db/experiencesDB.js";
import { createIndexes as createSessionIndexes } from "./backend/db/sessionsDB.js";
import { createIndexes as createUserIndexes } from "./backend/db/usersDB.js";
import authRouter from "./backend/routes/auth.js";
import experiencesRouter from "./backend/routes/experiences.js";
import metaRouter from "./backend/routes/meta.js";
import sessionsRouter from "./backend/routes/sessions.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(dirname, "frontend", "dist");
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set. Copy .env.example to .env.");
}

await connectToDb();
await Promise.all([
  createUserIndexes(),
  createExperienceIndexes(),
  createSessionIndexes(),
]);

const app = express();
// Render sits behind a proxy, which secure cookies need to know about.
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: getClient(),
      dbName: process.env.DB_NAME || "huskyprep",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/meta", metaRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found." }));

app.use(express.static(distDir));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`HuskyPrep running on http://localhost:${PORT}`);
});
