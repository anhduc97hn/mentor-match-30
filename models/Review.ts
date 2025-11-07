import mongoose, { Schema, Document, Types } from 'mongoose';
import { ISession } from './Session';

export interface IReview extends Document {
  content: string;
  rating: number;
  session: Types.ObjectId | ISession;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    session: { type: Schema.Types.ObjectId, required: true, ref: "Session" },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;