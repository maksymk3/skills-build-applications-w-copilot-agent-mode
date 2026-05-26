import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  description: string;
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  durationMinutes: { type: Number, required: true },
  intensity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  createdAt: { type: Date, default: Date.now },
});

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
