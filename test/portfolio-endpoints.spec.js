const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Portfolio Endpoints", function() {
  let db;

  const { testUsers, testSkills, testProjects } = helpers.makeFixtures();

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

  describe(`GET /api/portfolio/:user_name`, () => {
    context(`Given there are users with projects in the database`, () => {
      beforeEach("insert data", () =>
        helpers.seedTables(db, testUsers, testSkills, testProjects)
      );
      it(`responds with 200 and the portfolio data for the specified user`, () => {
        const userName = testUsers[1].user_name;
        const expectedPortfolio = {
          id: testUsers[1].id,
          user_name: testUsers[1].user_name,
          full_name: testUsers[1].full_name,
          title: testUsers[1].title,
          bio: testUsers[1].bio,
          theme_color: testUsers[1].theme_color,
          github_url: testUsers[1].github_url,
          linkedin_url: testUsers[1].linkedin_url,
          email_address: testUsers[1].email_address,
          projects: [
            {
              id: 2,
              name: "project 2",
              description: "project description 2",
              skills: [
                { id: 4, name: "Skill 4" },
                { id: 3, name: "Skill 3" },
                { id: 2, name: "Skill 2" }
              ],
              github_url: "github2.com",
              demo_url: "demo2.url",
              image_url: "image2.url"
            }
          ]
        };
        return supertest(app)
          .get(`/api/portfolio/${userName}`)
          .expect(200, expectedPortfolio);
      });
    });
  });
});
