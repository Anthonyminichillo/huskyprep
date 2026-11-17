import bcrypt from "bcrypt";
import { Router } from "express";
import passport from "../auth/passport.js";
import { createUser, findUserByUsername } from "../db/usersDB.js";

const router = Router();

function publicUser(user) {
  return { _id: user._id, username: user.username };
}

router.get("/me", (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

router.post("/signup", async (req, res, next) => {
  const username = String(req.body.username || "")
    .trim()
    .toLowerCase();
  const password = String(req.body.password || "");
  const errors = {};
  if (!/^[a-z0-9_.]{3,30}$/.test(username)) {
    errors.username = "Use 3-30 letters, numbers, dots or underscores.";
  }
  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!errors.username && (await findUserByUsername(username))) {
    errors.username = "That username is taken.";
  }
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const user = await createUser(username, await bcrypt.hash(password, 10));
  req.login(user, (err) => {
    if (err) return next(err);
    res.status(201).json({ user: publicUser(user) });
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message });
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json({ user: publicUser(user) });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ user: null });
  });
});

export default router;
