import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  members: string[];
  score: number;
  createdAt: Date;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true },
  members: { type: [String], default: [] },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);
