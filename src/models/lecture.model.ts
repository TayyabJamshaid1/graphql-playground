import mongoose, { Schema, Document, Model } from "mongoose";

// Resource Interface and Schema
export interface IResource extends Document {
  title: string;
  url: string;
}

const ResourceSchema: Schema<IResource> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true } // Enable _id for resources
);

// VideoUrl Interface and Schema
export interface IVideoUrl {
  _480p?: string;
  _720p?: string;
  _1080p?: string;
}

const VideoUrlSchema: Schema<IVideoUrl> = new Schema(
  {
    _480p: {
      type: String,
      trim: true,
    },
    _720p: {
      type: String,
      trim: true,
    },
    _1080p: {
      type: String,
      trim: true,
    },
  },
  { _id: false } // No separate _id for videoUrl
);

// Lecture Interface and Schema
export interface ILecture extends Document {
  title: string;
  description: string;
  videoUrl: IVideoUrl;
  resources: IResource[];
  courseId?: mongoose.Types.ObjectId; // Optional: link to course
  duration?: number; // Optional: lecture duration in minutes
  order?: number; // Optional: lecture order in the course
  isFree?: boolean; // Optional: whether lecture is free preview
  createdAt: Date;
  updatedAt: Date;
}

const LectureSchema: Schema<ILecture> = new Schema(
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
    videoUrl: {
      type: VideoUrlSchema,
      required: true,
      default: {},
    },
    resources: {
      type: [ResourceSchema],
      default: [],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    duration: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

const LectureModel: Model<ILecture> =
  mongoose.models.Lecture || mongoose.model<ILecture>("Lecture", LectureSchema);

export default LectureModel;