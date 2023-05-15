import { Express, Request, Response } from "express";
import {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "./controller/product.controller";
import {
  createSurveyHandler,
  deleteSurveyHandler,
  getSurveyHandler,
  getSurveysByUserIdHandler,
  updateSurveyHandler
} from "./controller/survey.controller"
import {
  createUrlHandler,
  deleteUrlHandler,
  getUrlHandler,
  getUrlByLinkHandler,
  getUrlsByUserIdHandler,
  updateUrlHandler,
} from "./controller/url.controller"
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectHandler,
  getProjectsByUserIdHandler,
  updateProjectHandler,
} from "./controller/project.controller"
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "./controller/session.controller";
import { createUserHandler, getUsersHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import {
  createSurveySchema,
  deleteSurveySchema,
  getSurveySchema,
  updateSurveySchema,
} from "./schema/survey.schema"
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import {
  createUrlSchema,
  deleteUrlSchema,
  getUrlSchema,
  getUrlByLinkSchema,
  updateUrlSchema,
} from "./schema/url.schema";
import {
  createProjectSchema,
  deleteProjectSchema,
  getProjectSchema,
  updateProjectSchema,
} from "./schema/project.schema";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schema/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schema/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.get("/api/users", requireUser, getUsersHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.post(
    "/api/products",
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );

  /**
   * @openapi
   * '/api/products/{productId}':
   *  get:
   *     tags:
   *     - Products
   *     summary: Get a single product by the productId
   *     parameters:
   *      - name: productId
   *        in: path
   *        description: The id of the product
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Product'
   *       404:
   *         description: Product not found
   */
  app.put(
    "/api/products/:productId",
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );

  app.get(
    "/api/products/:productId",
    validateResource(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );

  /**
   * @openapi
   * '/api/surveys':
   *  post:
   *     tags:
   *     - Survey
   *     summary: Create a survey
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schema/CreateSurveyInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schema/CreateSurveyResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post(
    "/api/surveys",
    [requireUser, validateResource(createSurveySchema)],
    createSurveyHandler
  );

  /**
   * @openapi
   * '/api/surveys/{surveyId}':
   *  get:
   *     tags:
   *     - Survey
   *     summary: Get a single survey by the surveyId
   *     parameters:
   *      - name: surveyId
   *        in: path
   *        description: The id of the survey
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Survey'
   *       404:
   *         description: Survey not found
   *  put:
   *     tags:
   *     - Survey
   *     summary: Update a survey
   *     parameters:
   *      - name: surveyId
   *        in: path
   *        description: The id of the survey
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *           $ref: '#/components/schema/UpdateSurveyInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Survey'
   *       404:
   *         description: Survey not found
   */
  app.put(
    "/api/surveys/:surveyId",
    [requireUser, validateResource(updateSurveySchema)],
    updateSurveyHandler
  );

  app.get(
    "/api/surveys/:surveyId",
    validateResource(getSurveySchema),
    getSurveyHandler
  );

  app.get(
    "/api/surveys",
    [requireUser],
    getSurveysByUserIdHandler
  )

  app.delete(
    "/api/surveys/:surveyId",
    [requireUser, validateResource(deleteSurveySchema)],
    deleteSurveyHandler
  );

  /**
   * @openapi
   * '/api/url':
   *  post:
   *     tags:
   *     - Url
   *     summary: Create a url record with surveyId, userId and url link
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schema/CreateUrlInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schema/CreateUrlResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */

  app.post(
    "/api/url",
    validateResource(createUrlSchema),
    createUrlHandler
  )

  /**
   * @openapi
   * '/api/url/{urlId}':
   *  get:
   *     tags:
   *     - Url
   *     summary: Get a url record by the urlId
   *     parameters:
   *      - name: urlId
   *        in: path
   *        description: The id of the url record
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Url'
   *       404:
   *         description: Url not found
   *  put:
   *     tags:
   *     - Url
   *     summary: Update a url record
   *     parameters:
   *      - name: urlId
   *        in: path
   *        description: The id of the url record
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *           $ref: '#/components/schema/UpdateUrlInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Url'
   *       404:
   *         description: Url not found
   */

  app.put(
    "/api/url/:urlId",
    [requireUser, validateResource(updateUrlSchema)],
    updateUrlHandler
  )

  app.get(
    "/api/url/:urlId",
    validateResource(getUrlSchema),
    getUrlHandler
  );

  app.get(
    "/api/urls",
    [requireUser],
    getUrlsByUserIdHandler
  );

  app.get(
    "/api/urllink/:url(*)",
    [validateResource(getUrlByLinkSchema)],
    getUrlByLinkHandler
  )

  app.delete(
    "/api/url/:urlId",
    [requireUser, validateResource(deleteUrlSchema)],
    deleteUrlHandler
  );

  app.post(
    "/api/projects",
    [requireUser, validateResource(createProjectSchema)],
    createProjectHandler
  );

  /**
   * @openapi
   * '/api/projects/{projectId}':
   *  get:
   *     tags:
   *     - Project
   *     summary: Get a single project by the projectId
   *     parameters:
   *      - name: projectId
   *        in: path
   *        description: The id of the project
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Project'
   *       404:
   *         description: Project not found
   *  put:
   *     tags:
   *     - Project
   *     summary: Update a project
   *     parameters:
   *      - name: projectId
   *        in: path
   *        description: The id of the project
   *        required: true
   *     requestBody:
   *      required: true
   *      content:
   *       application/json:
   *        schema:
   *           $ref: '#/components/schema/UpdateProjectInput'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/Project'
   *       404:
   *         description: Project not found
   *  delete:
   *        tags:
   *        - Project
   *        summary: Delete a project
   *        parameters:
   *        - name: projectId
   *          in: path
   *          description: The id of the project
   *          required: true
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *               $ref: '#/components/schema/UpdateProjectInput'
   *        responses:
   *          200:
   *              description: Success
   *              content:
   *                application/json:
   *                  schema:
   *                    $ref: '#/components/schema/Project'
   *          404:
   *             description: Project not found
   *           
   */
  app.put(
    "/api/projects/:projectId",
    [requireUser, validateResource(updateProjectSchema)],
    updateProjectHandler
  );

  app.get(
    "/api/projects/:projectId",
    validateResource(getProjectSchema),
    getProjectHandler
  );

  app.get(
    "/api/projects",
    [requireUser],
    getProjectsByUserIdHandler
  )

  app.delete(
    "/api/projects/:projectId",
    [requireUser, validateResource(deleteProjectSchema)],
    deleteProjectHandler
  );
}

export default routes;
