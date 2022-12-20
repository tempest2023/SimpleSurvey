import { object, number, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Survey:
 *       type: object
 *       required:
 *        - title
 *        - content
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 */

const payload = {
  body: object({
    title: string({
      required_error: "survey title is required",
    }).min(120, "Title should be at most 120 characters long"),
    content: string({
      required_error: "survey content is required",
    }),
  }),
};

const params = {
  params: object({
    surveyId: string({
      required_error: "surveyId is required",
    }),
  }),
};

export const createSurveySchema = object({
  ...payload,
});

export const updateSurveySchema = object({
  ...payload,
  ...params,
});

export const deleteSurveySchema = object({
  ...params,
});

export const getSurveySchema = object({
  ...params,
});

export type CreateSurveyInput = TypeOf<typeof createSurveySchema>;
export type UpdateSurveyInput = TypeOf<typeof updateSurveySchema>;
export type ReadSurveyInput = TypeOf<typeof getSurveySchema>;
export type DeleteSurveyInput = TypeOf<typeof deleteSurveySchema>;