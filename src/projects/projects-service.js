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
      name: project.name,
      description: project.description,
      skills: project.skills,
      github_url: project.github_url,
      demo_url: project.demo_url,
      image_url: project.image_url,
      user_id: project.user_id
    };
  }
};

module.exports = ProjectsService;
