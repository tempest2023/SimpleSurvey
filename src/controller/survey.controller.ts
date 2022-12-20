import { Request, Response } from "express";
import {
  CreateSurveyInput,
  UpdateSurveyInput,
} from "../schema/survey.schema";
import {
  createSurvey,
  deleteSurvey,
  findAndUpdateSurvey,
  findSurvey,
} from "../service/survey.service";

export async function createSurveyHandler(
  req: Request<{}, {}, CreateSurveyInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

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

export async function getSurveyHandler(
  req: Request<UpdateSurveyInput["params"]>,
  res: Response
) {
  const surveyId = req.params.surveyId;
  const survey = await findSurvey({ surveyId });

  if (!survey) {
    return res.sendStatus(404);
  }

  return res.send(survey);
}

export async function deleteSurveyHandler(
  req: Request<UpdateSurveyInput["params"]>,
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
