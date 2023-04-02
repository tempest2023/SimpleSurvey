import { array, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *    schema:
 *      Project:
 *        type: object
 *        required:
 *          - projectId
 *          - admin
 *          - survey
 *          - name
 *          - users
 *          - description
 *        properties:
 *          projectId:
 *            type: string
 *          admin:
 *            type: string
 *          survey:
 *            type: string
 *          name:
 *            type: string
 *          users:
 *            type: array
 *          description:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *      CreateProjectInput:
 *        type: object
 *        required:
 *          - users
 *          - survey
 *          - name
 *          - description
 *        properties:
 *          users:
 *            type: array
 *          survey:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *      CreateProjectResponse:
 *        schema:
 *          $ref: '#/components/schema/Project'
 *      UpdateProjectInput:
 *        type: object
 *        required:
 *          - projectId
 *          - users
 *          - survey
 *          - name
 *          - description
 *        properties:
 *          projectId:
 *            type: string
 *          users:
 *            type: array
 *          survey:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 */

const payload = {
  body: object({
    users: array(string()).min(0, "There must be at least 1 user in users"),
    survey: string({
      required_error: "surveyId is required",
    }),
    name: string({
      required_error: "name userid is required",
    }).min(4, "name must be at least 4 characters long"),
    description: string({
      required_error: "description is required",
    }).min(6, "description must be at least 4 characters long")
  }),
};

const params = {
  params: object({
    projectId: string({
      required_error: "projectId is required",
    }),
  }),
};

export const createProjectSchema = object({
  ...payload,
});

export const updateProjectSchema = object({
  ...payload,
  ...params,
});

export const deleteProjectSchema = object({
  ...params,
});

export const getProjectSchema = object({
  ...params,
});

export type CreateProjectInput = TypeOf<typeof createProjectSchema>;
export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>;
export type ReadProjectInput = TypeOf<typeof getProjectSchema>;
export type DeleteProjectInput = TypeOf<typeof deleteProjectSchema>;