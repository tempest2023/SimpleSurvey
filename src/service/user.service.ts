import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import { PermissionEnum } from "../schema/user.schema"



export async function createUser(input: UserInput) {
  try {
    const firstName = input.firstName;
    const lastName = input.lastName;
    const email = input.email;
    const role = input.role;
    const parentId = input.parent_id;
    const creator = await UserModel.findById(parentId);
    const permission = input.permission;
    if (!creator) {
      throw new Error("Cannot find the target creator");
    }
    if (!creator.permission.has(role as PermissionEnum)) {
      throw new Error("You do not have permission to create this role!");
    }
    const user = await UserModel.create({
      firstName,lastName,email,role,parentId,permission,
    });
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}
//deleteUser
export async function deleteUser(input: { _id?: number}) {
  try {
    const userId = input._id;
    const deleteUser = await UserModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      throw new Error("The person you want to delete does not exist!");
    }
    return omit(deleteUser.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

//getUser
export async function getUser(input: { _id?: number}) {
  try {
    const userId = input._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("The person you want to find does not exist!");
    }
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}



export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}


