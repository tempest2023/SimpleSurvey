import { Request, Response } from "express";
import {
  CreateSurveyInput,
  UpdateSurveyInput,
  ReadSurveyInput,
  DeleteSurveyInput
} from "../schema/survey.schema";
import {
  createSurvey,
  deleteSurvey,
  findAndUpdateSurvey,
  findSurvey,
  findSurveys,
} from "../service/survey.service";

export async function createSurveyHandler(
  req: Request<{}, {}, CreateSurveyInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  console.log('[debug][survey.controller.ts] create a new survey, userId: ', userId);
  const body = req.body;

  const survey = await createSurvey({ ...body, user: userId });

  return res.send(survey);
}

export async function updateSurveyHandler(
  req: Request<UpdateSurveyInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const surveyId = req.params.surveyId;
  const update = req.body;

  const survey = await findSurvey({ surveyId });

  if (!survey) {
    return res.sendStatus(404);
  }

  if (String(survey.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedSurvey = await findAndUpdateSurvey({ surveyId }, update, {
    new: true,
  });

  return res.send(updatedSurvey);
}

/**
 * Get survey by surveyId
 * @param req surveyId
 * @param res survey object
 * @returns 
 */
export async function getSurveyHandler(
  req: Request<ReadSurveyInput["params"]>,
  res: Response
) {
  const surveyId = req.params.surveyId;
  const survey = await findSurvey({ _id: surveyId });

  if (!survey) {
    return res.sendStatus(404);
  }

  return res.send(survey);
}

export async function getSurveysByUserIdHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const surveys = await findSurveys({ user: userId });

  if (!surveys) {
    return res.sendStatus(404);
  }

  return res.send(surveys);
}

export async function deleteSurveyHandler(
  req: Request<DeleteSurveyInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const surveyId = req.params.surveyId;

  const survey = await findSurvey({ surveyId });

  if (!survey) {
    return res.sendStatus(404);
  }

  if (String(survey.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteSurvey({ surveyId });

  return res.sendStatus(200);
}
