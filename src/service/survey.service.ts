import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SurveyModel, {
  SurveyDocument,
  SurveyInput,
} from "../models/survey.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createSurvey(input: SurveyInput) {
  const metricsLabels = {
    operation: "createSurvey",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await SurveyModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findSurvey(
  query: FilterQuery<SurveyDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findSurvey",
  };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await SurveyModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function findSurveys(
  query: FilterQuery<SurveyDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findSurveys",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await SurveyModel.find(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function findAndUpdateSurvey(
  query: FilterQuery<SurveyDocument>,
  update: UpdateQuery<SurveyDocument>,
  options: QueryOptions
) {
  return SurveyModel.findOneAndUpdate(query, update, options);
}

export async function deleteSurvey(query: FilterQuery<SurveyDocument>) {
  return SurveyModel.deleteOne(query);
}
