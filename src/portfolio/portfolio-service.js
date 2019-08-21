const xss = require("xss");

const PortfolioService = {
  getPortfolioData(db, user_name) {
    return db.raw(`select u.id, u.user_name, u.full_name, u.title, u. bio, u.profile_picture, u.theme_color, u.banner_image, u.github_url, u.linkedin_url, u.email_address,
    (select json_agg(proj)
    from (
      select p.id, p.name, p.description, p.skills, p.github_url, p.demo_url, p.image_url from projects p where p.user_id = u.id
      ) proj
    ) as projects
        from users u where u.user_name = '${user_name}'`);
  },
  serializePortfolio(portfolio) {
    return {
      id: portfolio.id,
      user_name: xss(portfolio.user_name),
      full_name: xss(portfolio.full_name),
      title: xss(portfolio.title),
      bio: xss(portfolio.bio),
      profile_picture: xss(portfolio.profile_picture),
      theme_color: portfolio.theme_color,
      banner_image: portfolio.banner_image,
      github_url: xss(portfolio.github_url),
      linkedin_url: xss(portfolio.linkedin_url),
      email_address: xss(portfolio.email_address),
      projects: portfolio.projects.map(project => {
        return {
          id: project.id,
          name: xss(project.name),
          description: xss(project.description),
          skills: project.skills,
          github_url: xss(project.github_url),
          demo_url: xss(project.demo_url),
          image_url: xss(project.image_url)
        };
      })
    };
  }
};

module.exports = PortfolioService;
