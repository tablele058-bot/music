export const dynamic = "force-dynamic";

import { connectMongoose } from "@/lib/mongoose";
import { Song } from "@/models/Song";
import SpotifyApp from "./components/SpotifyApp";

export default async function Home() {
  await connectMongoose();
  const docs = await Song.find().sort({ createdAt: 1 }).limit(24).lean();
  const songs = docs.map((d: any) => ({
    _id: d._id.toString(),
    title: d.title,
    artist: d.artist,
    album: d.album || "Single",
    coverUrl: d.coverUrl || `https://picsum.photos/seed/${d._id.toString()}/300/300`,
    audioUrl: d.audioUrl,
    duration: d.duration || 200,
  }));
  return <SpotifyApp initialSongs={songs} />;
}
