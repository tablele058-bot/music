import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongoose } from "@/lib/mongoose";
import { Song } from "@/models/Song";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    await connectMongoose();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
    const doc = await Song.findById(id);
    if (!doc) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    // try delete files
    try {
      if (doc.audioUrl?.startsWith("/songs/")) {
        const p = path.join(process.cwd(), "public", doc.audioUrl);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
      if (doc.coverUrl?.startsWith("/covers/")) {
        const p = path.join(process.cwd(), "public", doc.coverUrl);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
    } catch {}
    await Song.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
