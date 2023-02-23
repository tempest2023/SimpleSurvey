import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface SurveyInput {
  user: UserDocument["_id"]; // ObjectId, a Ref to User
  title: string;
  content: object;
}

export interface SurveyDocument extends SurveyInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const surveySchema = new mongoose.Schema(
  {
    surveyId: {
      type: String,
      required: true,
      unique: true,
      default: () => `survey_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: Object, required: true, default: {} },
  },
  {
    timestamps: true,
  }
);

const SurveyModel = mongoose.model<SurveyDocument>("Survey", surveySchema);

export default SurveyModel;
