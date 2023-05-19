import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUrlInput,
  UpdateUrlInput,
  ReadUrlInput,
  ReadUrlByLinkInput,
  DeleteUrlInput,
} from "../schema/url.schema";
import {
  createUrl,
  deleteUrl,
  findAndUpdateUrl,
  findUrl,
  findUrls,
} from "../service/url.service";
import {
  findSurvey
} from "../service/survey.service";

export async function createUrlHandler(
  req: Request<{}, {}, CreateUrlInput["body"]>,
  res: Response
) {
  const body = req.body;
  let link = body.url || `publish_survey/${nanoid(12)}`;
  // get survey document id by surveyId
  const surveyId = body.surveyId;
  const survey = await findSurvey({ surveyId });
  if (!survey) {
    return res.sendStatus(404);
  }
  const url = await createUrl({ ...body, surveyId: survey._id, url: link });
  return res.send(url);
}

export async function updateUrlHandler(
  req: Request<UpdateUrlInput["params"]>,
  res: Response
) {
  
  const urlId = req.params.urlId;
  const update = req.body;

  const url = await findUrl({ urlId });

  if (!url) {
    return res.sendStatus(404);
  }

  const updatedUrl = await findAndUpdateUrl({ urlId }, update, {
    new: true,
  });

  return res.send(updatedUrl);
}

export async function getUrlHandler(
  req: Request<ReadUrlInput["params"]>,
  res: Response
) {
  const urlId = req.params.urlId;
  const url = await findUrl({ urlId });

  if (!url) {
    return res.sendStatus(404);
  }

  return res.send(url);
}

export async function getUrlByLinkHandler(
  req: Request<ReadUrlByLinkInput["params"]>,
  res: Response
) {
  const url = req.params.url;
  const urlRes = await findUrl({ url});
  // console.log('[log][url.controller.ts] getUrlByLink, link: ', url, ', urlRes: ', urlRes)
  if (!urlRes) {
    return res.sendStatus(404);
  }
  return res.send(urlRes);
}

export async function getUrlsByUserIdHandler(
  req: Request,
  res: Response
) {
  const userId = res.locals.user._id;
  const urlRes = await findUrls({ userId });

  if (!urlRes) {
    return res.sendStatus(404);
  }
  return res.send(urlRes);
}

export async function deleteUrlHandler(
  req: Request<DeleteUrlInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const urlId = req.params.urlId;

  const url = await findUrl({ urlId });

  if (!url) {
    return res.sendStatus(404);
  }

  await deleteUrl({ urlId });

  return res.sendStatus(200);
}
