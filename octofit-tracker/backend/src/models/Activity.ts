import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  teamId: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  calories: number;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>({
  userId: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
