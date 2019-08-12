const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Users Endpoints", function() {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["user_name", "full_name", "password"];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: "test_user_name",
          password: "Testing123#",
          full_name: "test full_name"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });

      it(`responds 400 'Password must be at least 8 characters' when empty password`, () => {
        const userShortPassword = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: "1234567"
        };
        return supertest(app)
          .post("/api/users")
          .send(userShortPassword)
          .expect(400, {
            error: `Password must be at least 8 characters long`
          });
      });

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: "*".repeat(73)
        };
        return supertest(app)
          .post("/api/users")
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: " 1Aa!2Bb@"
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`
          });
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: "1Aa!2Bb@ "
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: "11AAaabb"
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `Password must contain at least one upper case letter, lower case letter, number and special character`
          });
      });

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          user_name: testUser.user_name,
          full_name: "test full_name",
          password: "11AAaa!!"
        };
        return supertest(app)
          .post("/api/users")
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` });
      });
    });

    context(`Happy path`, () => {
      it(`responds 201 with authToken`, () => {
        const newUser = {
          user_name: "test_user_name",
          full_name: "test full_name",
          password: "11AAaa!!"
        };
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("authToken");
          });
      });
    });
  });

  describe(`GET /api/users/:user_id`, () => {
    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
      it(`responds with 200 and the specified user data`, () => {
        const userName = "test-user-2";
        const user = testUsers[1];
        const expectedUser = {
          id: user.id,
          user_name: user.user_name,
          full_name: user.full_name,
          title: user.title,
          bio: user.bio,
          theme_color: user.theme_color,
          github_url: user.github_url,
          linkedin_url: user.linkedin_url,
          email_address: user.email_address
        };
        return supertest(app)
          .get(`/api/users/${userName}`)
          .expect(200, expectedUser);
      });
    });
  });

  describe(`PATCH /api/users/:user_id`, () => {
    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
      it(`responds with 204 and updates the user`, () => {
        const userNameToUpdate = "test-user-2";
        const body = {
          title: "updated user title",
          bio: "updated bio",
          github_url: "www.updated.com"
        };
        const expectedUser = {
          ...testUsers[1],
          ...body.updatedUserData
        };
        return supertest(app)
          .patch(`/api/users/${userNameToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .send(body)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`api/users/${userNameToUpdate}`)
              .expect(expectedUser);
          });
      });
    });
  });

  describe(`DELETE /api/users/:user_id`, () => {
    context(`Given there are users in the database`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
      it(`responds with 204 and removes the user`, () => {
        const userNameToRemove = "test-user-2";
        return supertest(app)
          .delete(`/api/users/${userNameToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .send(testUsers[1])
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/users/${userNameToRemove}`)
              .expect(404, {
                error: `User doesn't exist`
              });
          });
      });
    });
  });
});
