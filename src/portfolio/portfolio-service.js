const xss = require("xss");

const ProjectsService = {
  getPortfolioData(db, user_name) {
    return db.raw(`select u.id, u.user_name, u.full_name, u.title, u. bio, u.theme_color, u.github_url, u.linkedin_url, u.email_address,
    (select json_agg(proj)
    from (
      select p.id, p.name, p.description, p.skills, p.github_url, p.demo_url, p.image_url from projects p where p.user_id = u.id
      ) proj
    ) as projects
        from users u where u.user_name = '${user_name}'`);
  },
  serializePortfolio(portfolio) {}
};

module.exports = ProjectsService;
