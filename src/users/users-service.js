const bcrypt = require("bcryptjs");
const xss = require("xss");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\-\*_])[\S]+/;

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db("users")
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  getUser(db, user_name) {
    return db
      .from("users")
      .select("*")
      .where({ user_name })
      .first();
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  updateUser(db, user_name, updatedUserData) {
    return db("users")
      .where({ user_name })
      .update(updatedUserData);
  },
  deleteUser(db, user_name) {
    return db("users")
      .where({ user_name })
      .delete();
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length >= 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain at least one upper case letter, lower case letter, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name),
      title: xss(user.title),
      bio: xss(user.bio),
      theme_color: user.theme_color,
      github_url: xss(user.github_url),
      linkedin_url: xss(user.linkedin_url),
      email_address: xss(user.email_address)
    };
  }
};

module.exports = UsersService;
