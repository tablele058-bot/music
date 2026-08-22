import { NextResponse } from "next/server";
import { pingMongo } from "@/lib/mongodb";

export async function GET() {
  try {
    await pingMongo();
    return NextResponse.json({ ok: true, mongo: "connected", db: process.env.MONGODB_DB || "music" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, mongo: "failed", error: msg }, { status: 500 });
  }
}
