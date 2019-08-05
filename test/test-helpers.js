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

function makeFixtures() {
  const testSkills = makeSkillsArray();
  return { testSkills };
}

function seedTables(db, skills) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await trx.into("skills").insert(skills);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('skills_id_seq', ?)`, [
      skills[skills.length - 1].id
    ]);
  });
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        skills
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE skills_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('skills_id_seq', 0)`)
        ])
      )
  );
}

module.exports = {
  makeSkillsArray,
  makeFixtures,
  seedTables,
  cleanTables
};
