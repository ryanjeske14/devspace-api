const express = require("express");
const UsersService = require("../users/users-service");
const SkillsService = require("../skills/skills-service");
const PortfolioService = require("./portfolio-service");

const portfolioRouter = express.Router();

portfolioRouter
  .route("/:user_name")
  .get(checkUserExists, getSkills, (req, res, next) => {
    const skillset = res.skills;
    PortfolioService.getPortfolioData(req.app.get("db"), req.params.user_name)
      .then(portfolio => {
        return portfolio.rows[0];
      })
      .then(portfolio => {
        let projects = portfolio.projects === null ? [] : portfolio.projects;
        for (let project of projects) {
          let { skills } = project;
          skills = skills.map(skill => {
            return skillset.find(skillItem => skillItem.id === skill);
          });
          project.skills = skills;
        }
        portfolio.projects = projects;
        res.json(PortfolioService.serializePortfolio(portfolio));
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

async function getSkills(req, res, next) {
  try {
    const skills = await SkillsService.getSkills(req.app.get("db"));
    res.skills = skills;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = portfolioRouter;
