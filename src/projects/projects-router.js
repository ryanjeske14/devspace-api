const express = require("express");
const path = require("path");
const ProjectsService = require("./projects-service");
const { requireAuth } = require("../middleware/jwt-auth");

const projectsRouter = express.Router();
const jsonBodyParser = express.json();

projectsRouter
  .route("/")
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {
      name,
      description,
      skills,
      github_url,
      demo_url,
      image_url
    } = req.body;
    const newProject = {
      name,
      description,
      skills,
      github_url,
      demo_url,
      image_url
    };

    for (const [key, value] of Object.entries(newProject)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    newProject.user_id = req.user.id;

    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then(project => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(ProjectsService.serializeProject(project));
      })
      .catch(next);
  });

projectsRouter
  .route("/:project_id")
  .all(checkProjectExists)
  .get((req, res, next) => {
    ProjectsService.getById(req.app.get("db"), req.params.project_id)
      .then(project => {
        res.json(ProjectsService.serializeProject(project));
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const acceptableFields = [
      "name",
      "description",
      "skills",
      "github_url",
      "demo_url",
      "image_url"
    ];

    const projectToUpdate = {};

    for (let field of acceptableFields) {
      if (req.body.hasOwnProperty(field)) {
        projectToUpdate[field] = req.body[field];
      }
    }

    // only allow users to modify their own profile, and not other users' profiles
    if (req.user.id !== res.project.user_id) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only edit your own projects!"
        }
      });
    }
    // check to make sure body contains fields to update
    const numberOfValues = Object.values(projectToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one of the following: 'name', 'description', 'skills', 'github_url', 'demo_url', 'image_url'`
        }
      });

    ProjectsService.updateProject(
      req.app.get("db"),
      req.params.project_id,
      projectToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    const projectToDelete = res.project;
    // only allow users to delete their own projects, and not other users' projects
    if (req.user.id !== projectToDelete.user_id) {
      return res.status(401).json({
        error: {
          message:
            "Unauthorized request: You may only delete your own projects!"
        }
      });
    }

    ProjectsService.deleteProject(req.app.get("db"), req.params.project_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkProjectExists(req, res, next) {
  try {
    const project = await ProjectsService.getById(
      req.app.get("db"),
      req.params.project_id
    );

    if (!project) {
      return res.status(404).json({
        error: `Project doesn't exist`
      });
    }

    res.project = project;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = projectsRouter;
