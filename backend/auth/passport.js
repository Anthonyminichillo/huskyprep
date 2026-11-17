import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserById, findUserByUsername } from "../db/usersDB.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return done(null, false, { message: "Wrong username or password." });
      }
      return done(null, { _id: user._id, username: user.username });
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => done(null, String(user._id)));

passport.deserializeUser(async (id, done) => {
  try {
    done(null, (await findUserById(id)) || false);
  } catch (err) {
    done(err);
  }
});

export default passport;
