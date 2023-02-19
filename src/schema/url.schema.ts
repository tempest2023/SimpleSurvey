import { object, number, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Url:
 *       type: object
 *       required:
 *        - surveyId
 *        - userId
 *        - url
 *       properties:
 *         userId:
 *           type: string
 *         surveyId:
 *           type: string
 *         url:
 *           type: string
 *     CreateUrlInput:
 *       type: object
 *       required:
 *        - surveyId
 *        - userId
 *       properties:
 *         userId:
 *           type: string
 *         surveyId:
 *           type: string
 *     CreateUrlResponse:
 *       type: object
 *       properties:
 *         urlId:
 *           type: string
 *         userId:
 *           type: string
 *         surveyId:
 *           type: string
 *         url:
 *           type: string
 *     UpdateUrlInput:
 *       type: object
 *       required:
 *         - urlId
 *       properties:
 *         urlId:
 *           type: string
 *         userId:
 *           type: string
 *         surveyId:
 *           type: string
 *         url:
 *           type: string
 * 
 */

const payload = {
  body: object({
    surveyId: string({
      required_error: "surveyId is required",
    }),
    userId: string({
      required_error: "userId is required",
    }),
    url: string({
      required_error: "url is required",
    }).optional(),
  }),
};

const params = {
  params: object({
    urlId: string({
      required_error: "urlId is required",
    }),
  }),
};

export const createUrlSchema = object({
  ...payload,
});

export const updateUrlSchema = object({
  ...payload,
  ...params,
});

export const deleteUrlSchema = object({
  ...params,
});

export const getUrlSchema = object({
  ...params,
});

export const getUrlByLinkSchema = object({
  params: object({
    url: string({
      required_error: "url is required",
    }),
  }),
});

export type CreateUrlInput = TypeOf<typeof createUrlSchema>;
export type UpdateUrlInput = TypeOf<typeof updateUrlSchema>;
export type ReadUrlInput = TypeOf<typeof getUrlSchema>;
export type ReadUrlByLinkInput = TypeOf<typeof getUrlByLinkSchema>;
export type DeleteUrlInput = TypeOf<typeof deleteUrlSchema>;
