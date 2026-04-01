import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId | IUser; // 🔥 powerful
  price: number;
  ratingAverage: number;
  ratingQuantity: number;
  category: string;
  subCategory: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
       type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const CourseModel: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default CourseModel;