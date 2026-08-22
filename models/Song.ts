import mongoose, { Schema, Model } from "mongoose";

export interface ISong {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
  source?: string;
  createdAt: Date;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true, index: true },
  artist: { type: String, required: true, index: true },
  album: String,
  genre: String,
  coverUrl: String,
  audioUrl: { type: String, required: true },
  duration: Number,
  source: { type: String, default: "github" },
  createdAt: { type: Date, default: Date.now },
});

export const Song: Model<ISong> = mongoose.models.Song || mongoose.model<ISong>("Song", SongSchema);
