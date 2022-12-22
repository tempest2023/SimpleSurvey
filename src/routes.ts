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
  updateSurveyHandler,
} from "./controller/survey.controller"
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
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

  app.delete(
    "/api/surveys/:surveyId",
    [requireUser, validateResource(deleteSurveySchema)],
    deleteSurveyHandler
  );
}

export default routes;
