import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongoose } from "@/lib/mongoose";
import { Song } from "@/models/Song";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    await connectMongoose();
    const form = await req.formData();
    const title = (form.get("title") as string)?.trim();
    const artist = (form.get("artist") as string)?.trim();
    const album = (form.get("album") as string)?.trim();
    const genre = (form.get("genre") as string)?.trim();
    const cover = form.get("cover") as File | null;
    const audio = form.get("audio") as File | null;

    if (!title || !artist || !audio) return NextResponse.json({ ok: false, error: "title, artist, audio required" }, { status: 400 });

    const slug = `${artist.toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`.replace(/^-|-$/g,"");
    const songsDir = path.join(process.cwd(), "public", "songs");
    const coversDir = path.join(process.cwd(), "public", "covers");
    await fs.promises.mkdir(songsDir, { recursive: true });
    await fs.promises.mkdir(coversDir, { recursive: true });

    // save audio
    const audioExt = (audio.name.split(".").pop() || "mp3").toLowerCase();
    const audioName = `${slug}.${audioExt}`;
    const audioPath = path.join(songsDir, audioName);
    const audioBuf = Buffer.from(await audio.arrayBuffer());
    await fs.promises.writeFile(audioPath, audioBuf);

    // save cover if provided, else use existing or placeholder
    let coverUrl = `https://picsum.photos/seed/${encodeURIComponent(slug)}/600/600`;
    if (cover && cover.size > 0) {
      const coverExt = (cover.name.split(".").pop() || "jpg").toLowerCase();
      const coverName = `${slug}.${coverExt}`;
      const coverPath = path.join(coversDir, coverName);
      const coverBuf = Buffer.from(await cover.arrayBuffer());
      await fs.promises.writeFile(coverPath, coverBuf);
      coverUrl = `/covers/${coverName}`;
    }

    const doc = await Song.create({
      title,
      artist,
      album: album || undefined,
      genre: genre || undefined,
      coverUrl,
      audioUrl: `/songs/${audioName}`,
      source: "admin-upload",
    });

    return NextResponse.json({ ok: true, song: doc });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
