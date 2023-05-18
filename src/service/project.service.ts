import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProjectModel, {
  ProjectDocument,
  ProjectInput,
} from "../models/project.model";
import { omit, result } from "lodash";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createProject(input: ProjectInput) {
  const metricsLabels = {
    operation: "createProject",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProjectModel.create(input);
    const resWithPop = await (await result.populate('admin')).populate("survey");
    timer({ ...metricsLabels, success: "true" });
    return omit(resWithPop.toJSON(), ['admin.password']);
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findProject(
  query: FilterQuery<ProjectDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findProject",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProjectModel.findOne(query, {}, options).populate("survey").populate("admin");
    timer({ ...metricsLabels, success: "true" });
    return omit(result, ['admin.password']);
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function findProjects(
  query: FilterQuery<ProjectDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findProjects",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await ProjectModel.find(query, {}, options).populate("survey").populate("admin").populate('users');
    timer({ ...metricsLabels, success: "true" });
    return result.map(project => omit(project, ['admin.password']))
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function findAndUpdateProject(
  query: FilterQuery<ProjectDocument>,
  update: UpdateQuery<ProjectDocument>,
  options: QueryOptions
) {
  const metricsLabels = {
    operation: "updateProject",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const project = ProjectModel.findOneAndUpdate(query, update, options);
    const result = await project.populate("survey").populate("admin");
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch(e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function deleteProject(query: FilterQuery<ProjectDocument>) {
  return ProjectModel.deleteOne(query);
}
