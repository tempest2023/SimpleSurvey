import { array, object, string, TypeOf, optional } from "zod";

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
 *          - name
 *          - description
 *        properties:
 *          users:
 *            type: array
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
    name: string({
      required_error: "name userid is required",
    }),
    description: string({
      required_error: "description is required",
    }),
    users: optional(array(string())),
    survey: optional(string()),
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