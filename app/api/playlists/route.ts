import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongoose } from "@/lib/mongoose";
import { Playlist } from "@/models/Playlist";

export async function GET() {
  try {
    await connectMongoose();
    const { userId } = await auth();
    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;
    const playlists = await Playlist.find(filter).populate("songs").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, playlists });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoose();
    const { userId } = await auth();
    const body = await req.json();
    const { name, description, coverUrl, type, songIds } = body as {
      name?: string;
      description?: string;
      coverUrl?: string;
      type?: "playlist" | "album";
      songIds?: string[];
    };
    if (!name?.trim()) return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
    const doc = await Playlist.create({
      name: name.trim(),
      description,
      coverUrl: coverUrl || `https://picsum.photos/seed/${encodeURIComponent(name)}/500/500`,
      songs: songIds || [],
      userId: userId || undefined,
      type: type === "album" ? "album" : "playlist",
    });
    return NextResponse.json({ ok: true, playlist: doc });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
