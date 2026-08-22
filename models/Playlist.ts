import mongoose, { Schema, Model, Types } from "mongoose";

export interface IPlaylist {
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Types.ObjectId[];
  userId?: string;
  type: "playlist" | "album";
  createdAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true, trim: true },
  description: String,
  coverUrl: { type: String, default: "https://picsum.photos/seed/playlist/500/500" },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  userId: { type: String, index: true },
  type: { type: String, enum: ["playlist", "album"], default: "playlist" },
  createdAt: { type: Date, default: Date.now },
});

export const Playlist: Model<IPlaylist> =
  mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
