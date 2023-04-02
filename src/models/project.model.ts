import mongoose from "mongoose";
import { SurveyDocument } from "./survey.model";
import { UserDocument } from "./user.model";

export interface ProjectInput {
  admin: UserDocument["_id"]; // ObjectId, a Ref to User
  survey: SurveyDocument["_id"]; // ObjectId, a Ref to Survey
  name: string;
  users: UserDocument["_id"][]; // Array of ObjectId, a Ref to User
  description: string;
}

export interface ProjectDocument extends ProjectInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    survey: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);

export default ProjectModel;
