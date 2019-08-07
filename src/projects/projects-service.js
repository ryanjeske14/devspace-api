const xss = require("xss");

const ProjectsService = {
  getById(db, id) {
    return db
      .from("projects")
      .select("*")
      .where({ id })
      .first();
  },
  insertProject(db, newProject) {
    return db
      .insert(newProject)
      .into("projects")
      .returning("*")
      .then(([project]) => project);
  },
  updateProject(db, id, projectToUpdate) {
    return db("projects")
      .where({ id })
      .update(projectToUpdate);
  },
  deleteProject(db, id) {
    return db("projects")
      .where({ id })
      .delete();
  },
  serializeProject(project) {
    return {
      id: project.id,
      name: xss(project.name),
      description: xss(project.description),
      skills: project.skills,
      github_url: xss(project.github_url),
      demo_url: xss(project.demo_url),
      image_url: xss(project.image_url),
      user_id: project.user_id
    };
  }
};

module.exports = ProjectsService;
