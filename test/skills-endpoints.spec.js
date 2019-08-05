const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Skills Endpoints", function() {
  let db;

  const { testSkills } = helpers.makeFixtures();

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

  describe(`GET /api/skills`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/skills")
          .expect(200, []);
      });
    });
  });

  context(`Given there are skills in the database`, () => {
    beforeEach("insert skills data", () => helpers.seedTables(db, testSkills));

    it("responds with 200 and all of the skills", () => {
      const expectedSkills = testSkills;

      return supertest(app)
        .get("/api/skills")
        .expect(200, expectedSkills);
    });
  });
});