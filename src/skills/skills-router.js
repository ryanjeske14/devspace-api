const express = require("express");
const SkillsService = require("./skills-service");

const skillsRouter = express.Router();

skillsRouter.route("/").get((req, res, next) => {
  SkillsService.getSkills(req.app.get("db"))
    .then(skills => res.json(skills))
    .catch(next);
});

module.exports = skillsRouter;
