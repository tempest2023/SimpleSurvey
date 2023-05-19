import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";
import { SurveyDocument } from "./survey.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface UrlInput {
  userId: UserDocument["_id"];
  surveyId: SurveyDocument["_id"];
  url: string;
}

export interface UrlDocument extends UrlInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new mongoose.Schema(
  {
    urlId: {
      type: String,
      required: true,
      unique: true,
      default: () => `url_${nanoid()}`,
    },
    userId: { type: String, required: false },
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
    url: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const UrlModel = mongoose.model<UrlDocument>("Url", urlSchema);

export default UrlModel;
