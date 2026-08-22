import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongoose } from "@/lib/mongoose";
import { Playlist } from "@/models/Playlist";
import mongoose from "mongoose";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectMongoose();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
    const pl = await Playlist.findById(id).populate("songs").lean();
    if (!pl) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    return NextResponse.json({ ok: true, playlist: pl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectMongoose();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
    const body = await req.json();
    const { action, songId, name, description } = body as { action?: string; songId?: string; name?: string; description?: string };

    const pl = await Playlist.findById(id);
    if (!pl) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    if (action === "add" && songId) {
      if (!pl.songs.some((s: any) => s.toString() === songId)) {
        pl.songs.push(new mongoose.Types.ObjectId(songId) as any);
        await pl.save();
      }
    } else if (action === "remove" && songId) {
      pl.songs = pl.songs.filter((s: any) => s.toString() !== songId) as any;
      await pl.save();
    } else if (action === "rename" && name) {
      pl.name = name.trim();
      if (description !== undefined) pl.description = description;
      await pl.save();
    } else {
      return NextResponse.json({ ok: false, error: "invalid action" }, { status: 400 });
    }
    await pl.populate("songs");
    return NextResponse.json({ ok: true, playlist: pl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectMongoose();
    const { id } = await params;
    await Playlist.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
