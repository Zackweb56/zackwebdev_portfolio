import mongoose, { Schema, Model, Document } from "mongoose";

export interface ILanguage extends Document {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  isActive: boolean;
  isDefault: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nativeName: {
      type: String,
      required: true,
      trim: true,
    },
    flag: {
      type: String,
      required: true,
      trim: true,
    },
    direction: {
      type: String,
      enum: ["ltr", "rtl"],
      default: "ltr",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Language: Model<ILanguage> =
  mongoose.models.Language || mongoose.model<ILanguage>("Language", LanguageSchema);
