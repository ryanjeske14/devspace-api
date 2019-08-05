const SkillsService = {
  getSkills(db) {
    return db.from("skills").select("*");
  }
};

module.exports = SkillsService;
