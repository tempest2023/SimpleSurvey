import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { nanoid } from "nanoid";
import UrlModel, {
  UrlDocument,
  UrlInput,
} from "../models/url.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function createUrl(input: UrlInput) {
  const metricsLabels = {
    operation: "createUrl",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    // find url record by userId and surveyId
    const url = await findUrl({ userId: input.userId, surveyId: input.surveyId });
    // if it already exists, update it
    if (url) {
      const updatedUrl = await findAndUpdateUrl(
        { userId: input.userId, surveyId: input.surveyId },
        { url: input.url },
        { new: true }
      );
      timer({ ...metricsLabels, success: "true" });
      return updatedUrl;
    }
    const result = await UrlModel.create(input);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findUrl(
  query: FilterQuery<UrlDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findUrl",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await UrlModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findUrls(
  query: FilterQuery<UrlDocument>,
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findUrls",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await UrlModel.find(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findAndUpdateUrl(
  query: FilterQuery<UrlDocument>,
  update: UpdateQuery<UrlDocument>,
  options: QueryOptions
) {
  return UrlModel.findOneAndUpdate(query, update, options);
}

export async function deleteUrl(query: FilterQuery<UrlDocument>) {
  return UrlModel.deleteOne(query);
}
