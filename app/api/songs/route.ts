import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import { Song } from "@/models/Song";

export async function GET(req: Request) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const songs = await Song.find({ $or: [{ title: regex }, { artist: regex }, { album: regex }] })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      return NextResponse.json({ ok: true, count: songs.length, songs, q });
    }
    const songs = await Song.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ ok: true, count: songs.length, songs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoose();
    const body = await req.json();
    // allow single or bulk
    if (Array.isArray(body)) {
      const res = await Song.insertMany(body);
      return NextResponse.json({ ok: true, inserted: res.length });
    }
    const song = await Song.create(body);
    return NextResponse.json({ ok: true, song });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
