const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      password: "password",
      full_name: "User One",
      title: "Title One",
      bio: "I am developer one.",
      theme_color: "blue",
      github_url: "www.github.one",
      linkedin_url: "www.linkedin.one",
      email_address: "user.one@test.com"
    },
    {
      id: 2,
      user_name: "test-user-2",
      password: "password",
      full_name: "User Two",
      title: "Title Two",
      bio: "I am developer two.",
      theme_color: "red",
      github_url: "www.github.two",
      linkedin_url: "www.linkedin.two",
      email_address: "user.two@test.com"
    },
    {
      id: 3,
      user_name: "test-user-3",
      password: "password",
      full_name: "User Three",
      title: "Title Three",
      bio: "I am developer three.",
      theme_color: "green",
      github_url: "www.github.three",
      linkedin_url: "www.linkedin.three",
      email_address: "user.three@test.com"
    }
  ];
}

function makeSkillsArray() {
  return [
    {
      id: 1,
      name: "Skill 1"
    },
    {
      id: 2,
      name: "Skill 2"
    },
    {
      id: 3,
      name: "Skill 3"
    },
    {
      id: 4,
      name: "Skill 4"
    }
  ];
}

function makeProjectsArray() {
  return [
    {
      id: 1,
      name: "project 1",
      description: "project description 1",
      skills: "{1,2,3}",
      github_url: "github1.com",
      demo_url: "demo1.url",
      image_url: "image1.url",
      user_id: 3
    },
    {
      id: 2,
      name: "project 2",
      description: "project description 2",
      skills: "{4,3,2}",
      github_url: "github2.com",
      demo_url: "demo2.url",
      image_url: "image2.url",
      user_id: 2
    },
    {
      id: 3,
      name: "project 3",
      description: "project description 3",
      skills: "{2,3,4}",
      github_url: "github3.com",
      demo_url: "demo3.url",
      image_url: "image3.url",
      user_id: 1
    }
  ];
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testSkills = makeSkillsArray();
  const testProjects = makeProjectsArray();
  return { testUsers, testSkills, testProjects };
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedTables(db, users, skills, projects) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("skills").insert(skills);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('skills_id_seq', ?)`, [
      skills[skills.length - 1].id
    ]);
    await trx.into("projects").insert(projects);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('projects_id_seq', ?)`, [
      projects[projects.length - 1].id
    ]);
  });
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        projects,
        skills,
        users
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE projects_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE skills_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('projects_id_seq', 0)`),
          trx.raw(`SELECT setval('skills_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`)
        ])
      )
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeSkillsArray,
  makeFixtures,
  seedTables,
  cleanTables,
  seedUsers,
  makeAuthHeader
};
