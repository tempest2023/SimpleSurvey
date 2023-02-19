import { Request, Response } from "express";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { createUser, getUser} from "../service/user.service";
import logger from "../utils/logger";
import { PermissionSet } from "../schema/user.schema";
import { deleteUser } from "../service/user.service";
import { send } from "process";


export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
   
    console.log(res);
    const userId = res.locals.user._id;
    const permissionSet = new Set(req.body.permission) as PermissionSet;
    const user = await createUser({
      ...req.body, parent_id: userId, permission: permissionSet,
    });
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}


export async function deleteUserHandler(
  req: Request,
  res: Response
) {
  try {
   
   const userId = parseInt(req.params._id);
   const user = await deleteUser({ _id: userId});
   if (user) {
      res.status(204).send();
   }
  
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getUserHandler(
  req: Request,
  res: Response
) {
  try {
   
   const userId = parseInt(req.params._id);
   const user = await getUser({ _id: userId});
   if (user) {
      res.status(204).send();
   }
  return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}





