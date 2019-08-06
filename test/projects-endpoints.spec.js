const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Projects Endpoints", function() {
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

  describe(`POST /api/projects`, () => {
    context(`Project creation`, () => {
      beforeEach("insert data", () =>
        helpers.seedTables(db, testUsers, testSkills, testProjects)
      );

      const requiredFields = [
        "name",
        "description",
        "skills",
        "github_url",
        "demo_url",
        "image_url"
      ];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          name: "test name",
          description: "test description",
          skills: "{1,2,3}",
          github_url: "github.com",
          demo_url: "demo.com",
          image_url: "image.com"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/projects")
            .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });
    });
  });

  describe(`GET /api/projects/:project_id`, () => {
    context(`Given there are projects in the database`, () => {
      beforeEach("insert data", () =>
        helpers.seedTables(db, testUsers, testSkills, testProjects)
      );
      it(`responds with 200 and the specified project data`, () => {
        const projectId = 2;
        const expectedProject = {
          id: 2,
          name: "project 2",
          description: "project description 2",
          skills: [4, 3, 2],
          github_url: "github2.com",
          demo_url: "demo2.url",
          image_url: "image2.url",
          user_id: 2
        };
        return supertest(app)
          .get(`/api/projects/${projectId}`)
          .expect(200, expectedProject);
      });
    });
  });

  describe(`PATCH /api/projects/:project_id`, () => {
    context(`Given there are projects in the database`, () => {
      beforeEach("insert data", () =>
        helpers.seedTables(db, testUsers, testSkills, testProjects)
      );
      it(`responds with 204 and updates the project`, () => {
        const projectIdToUpdate = 2;
        const updatedProject = {
          name: "Name Modified",
          description: "Description Modified",
          user_id: 2
        };
        const expectedProject = {
          ...testProjects[projectIdToUpdate - 1],
          ...updatedProject
        };
        return supertest(app)
          .patch(`/api/projects/${projectIdToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .send(updatedProject)
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`api/projects/${projectIdToUpdate}`)
              .expect(expectedProject);
          });
      });
    });
  });

  describe(`DELETE /api/projects/:project_id`, () => {
    context(`Given there are projects in the database`, () => {
      beforeEach("insert data", () =>
        helpers.seedTables(db, testUsers, testSkills, testProjects)
      );
      it(`responds with 204 and removes the project`, () => {
        const projectIdToRemove = 2;
        return supertest(app)
          .delete(`/api/projects/${projectIdToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/projects/${projectIdToRemove}`)
              .expect(404, {
                error: `Project doesn't exist`
              });
          });
      });
    });
  });
});
