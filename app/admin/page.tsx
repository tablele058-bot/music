export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";
import { connectMongoose } from "@/lib/mongoose";
import { Song } from "@/models/Song";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  await connectMongoose();
  const songs = await Song.find().sort({ createdAt: -1 }).lean();
  const mapped = songs.map((s:any)=> ({
    _id: s._id.toString(),
    title: s.title,
    artist: s.artist,
    album: s.album,
    coverUrl: s.coverUrl,
    audioUrl: s.audioUrl,
  }));
  return <AdminClient initialSongs={mapped} />;
}
