const xss = require("xss");

const SkillsService = {
  getSkills(db) {
    return db.from("skills").select("*");
  },
  serializeSkills(skills) {
    return skills.map(skill => {
      return {
        id: skill.id,
        name: xss(skill.name)
      };
    });
  }
};

module.exports = SkillsService;
