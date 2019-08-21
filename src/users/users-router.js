const express = require("express");
const path = require("path");
const UsersService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");
const AuthService = require("./../auth/auth-service");

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const { password, user_name, full_name } = req.body;

  for (const field of ["user_name", "full_name", "password"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  if (user_name.includes(" ")) {
    return res.status(400).json({
      error: "Username cannot contain any spaces"
    });
  }

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), user_name)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          user_name,
          password: hashedPassword,
          full_name,
          date_created: "now()"
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          user => {
            const sub = user.user_name;
            const payload = { user_id: user.id };

            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.user_name}`))
              .send({
                authToken: AuthService.createJwt(sub, payload)
              });
          }
        );
      });
    })
    .catch(next);
});

usersRouter
  .route("/:user_name")
  .all(checkUserExists)
  .get((req, res, next) => {
    UsersService.getUser(req.app.get("db"), req.params.user_name).then(user => {
      res.json(UsersService.serializeUser(user));
    });
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const acceptableFields = [
      "full_name",
      "title",
      "bio",
      "profile_picture",
      "theme_color",
      "banner_image",
      "github_url",
      "linkedin_url",
      "email_address"
    ];

    const updatedUser = {};

    for (let field of acceptableFields) {
      if (req.body.hasOwnProperty(field)) {
        updatedUser[field] = req.body[field];
      }
    }

    // only allow users to modify their own profile, and not other users' profiles
    if (req.user.user_name !== req.params.user_name) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only edit your own profile!"
        }
      });
    }
    // check to make sure body contains fields to update
    const numberOfValues = Object.values(updatedUser).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one of the following: 'full_name', 'title', 'bio', 'profile_picture', theme_color', 'banner_image', 'github_url', 'linkedin_url', 'email_address'`
        }
      });

    UsersService.updateUser(req.app.get("db"), req.user.user_name, updatedUser)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    // only allow users to delete their own profile, and not other users' profiles
    if (req.user.user_name !== req.params.user_name) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only delete your own profile!"
        }
      });
    }

    UsersService.deleteUser(req.app.get("db"), req.user.user_name)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

// middleware to check if specific user exists in DB
async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.hasUserWithUserName(
      req.app.get("db"),
      req.params.user_name
    );

    if (!user)
      return res.status(404).json({
        error: `User doesn't exist`
      });

    res.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = usersRouter;
