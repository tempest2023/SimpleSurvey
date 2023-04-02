import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProjectModel, {
  ProjectDocument,
  ProjectInput,
} from "../models/project.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";
import {findSurvey} from "./survey.service";

export async function createProject(input: ProjectInput) {
  const metricsLabels = {
    operation: "createProject",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    // check whether the survey exists
    const survey = await findSurvey({ id: input.survey });
    if (survey) {
      throw new Error("Survey does not exist");
    }
    const result = await ProjectModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
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
    const result = await ProjectModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
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
    const result = await ProjectModel.find(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
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
  return ProjectModel.findOneAndUpdate(query, update, options);
}

export async function deleteProject(query: FilterQuery<ProjectDocument>) {
  return ProjectModel.deleteOne(query);
}
