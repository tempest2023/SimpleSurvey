import * as z from "zod";
import { array, object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
const UserRole = z.enum(["Admin", "Patient", "Clinician"]);
type UserRole = z.infer<typeof UserRole>;

export const UserPermission = z.enum([
  "createAdmin",
  "updateAdmin",
  "retrieveAdmin",
  "deleteAdmin",

  "createPatient",
  "updatePatient",
  "retrievePatient",
  "deletePatient",

  "createClin",
  "updateClin",
  "retrieveClin",
  "deleteClin",
]);
export type PermissionEnum = z.infer<typeof UserPermission>;

const PermissionSet = z.set(UserPermission);

export type PermissionSet = z.infer<typeof PermissionSet>;



export const createUserSchema = object({
  
  body: object({
    role: UserRole,
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Name is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    //
    permission: array(z.string()),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
