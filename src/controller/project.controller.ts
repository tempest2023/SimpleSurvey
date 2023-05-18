import { Request, Response } from "express";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ReadProjectInput,
  DeleteProjectInput
} from "../schema/project.schema";
import {
  createProject,
  deleteProject,
  findAndUpdateProject,
  findProject,
  findProjects,
} from "../service/project.service";
import { createSurvey } from "../service/survey.service";

export async function createProjectHandler(
  req: Request<{}, {}, CreateProjectInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  console.log('[debug][project.controller.ts] create a new project, userId: ', userId);
  const body = req.body;
  try {
    // create a new survey by admin
    const survey = await createSurvey({ 
      user: userId,
      title: "Untitled Survey",
      content: {}
     });
    const project = await createProject({ ...body, admin: userId, survey: survey._id });
    return res.send(project);
  } catch (e:any) {
    console.log('[debug][project.controller.ts] create a new project, error: ', e);
    if(e.message === "Survey does not exist") {
      return res.send({
        error: "Survey does not exist",
        errcode: 404
      })
    }
    return res.sendStatus(500);
  }
}

export async function updateProjectHandler(
  req: Request<UpdateProjectInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const projectId = req.params.projectId;
  const update = req.body;

  const project = await findProject({ _id: projectId });

  if (!project || Object.keys(project).length === 0) {
    return res.sendStatus(404);
  }

  if (String(project.admin._id) !== userId && !project.users?.includes(userId)) {
    return res.sendStatus(403);
  }

  const updatedProject = await findAndUpdateProject({ _id: projectId }, update, {
    new: true,
  });

  return res.send(updatedProject);
}

/**
 * Get project by projectId
 * @param req projectId
 * @param res project object
 * @returns 
 */
export async function getProjectHandler(
  req: Request<ReadProjectInput["params"]>,
  res: Response
) {
  const projectId = req.params.projectId;
  const project = await findProject({ _id: projectId });
  // console.log('[debug][project.controller.ts] get a project, project: ', project);
  if (!project || Object.keys(project).length === 0) {
    return res.sendStatus(404);
  }

  // permission check
  const userId = res.locals.user._id;
  if (String(project.admin._id) !== userId && !project.users?.includes(userId)) {
    return res.sendStatus(403);
  }

  return res.send(project);
}

export async function getProjectsByUserIdHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const projects = await findProjects({ admin: userId });

  if (!projects || projects.length === 0) {
    return res.sendStatus(404);
  }

  return res.send(projects);
}

export async function deleteProjectHandler(
  req: Request<DeleteProjectInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const projectId = req.params.projectId;

  const project = await findProject({ _id: projectId });
  // console.log('[debug][project.controller.ts] delete a project, project: ', project);
  if (!project || Object.keys(project).length === 0) {
    return res.sendStatus(404);
  }

  if (String(project.admin._id) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProject({ _id: projectId });

  return res.sendStatus(200);
}
