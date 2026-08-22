"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminClient({ initialSongs }: { initialSongs: any[] }) {
  const [songs, setSongs] = useState(initialSongs);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const r = await fetch("/api/songs");
    const j = await r.json();
    if(j.ok) setSongs(j.songs);
  };

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !artist || !audioFile) { setMsg("Title, artist and audio file required"); return; }
    setLoading(true); setMsg("");
    const fd = new FormData();
    fd.append("title", title);
    fd.append("artist", artist);
    fd.append("album", album);
    fd.append("genre", genre);
    if(coverFile) fd.append("cover", coverFile);
    fd.append("audio", audioFile);
    const r = await fetch("/api/upload", { method:"POST", body: fd });
    const j = await r.json();
    if(j.ok){
      setMsg(`Added ${j.song.title} — ${j.song.artist}`);
      setTitle(""); setArtist(""); setAlbum(""); setGenre(""); setCoverFile(null); setAudioFile(null);
      refresh();
    } else setMsg(j.error || "Failed");
    setLoading(false);
  };

  const del = async (id:string) => {
    if(!confirm("Delete this song?")) return;
    const r = await fetch(`/api/songs/${id}`, { method:"DELETE" });
    const j = await r.json();
    if(j.ok) setSongs(s=> s.filter((x:any)=> x._id!==id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">Admin — Add Actual Songs</h1>
          <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-sm">← Home</Link>
        </div>
        <p className="text-sm text-zinc-400 mb-4">Upload <b>actual complete MP3s</b> (Lana, Weeknd, Billie). Must be licensed files you own. Cover must exactly match song. This replaces the random SoundHelix demos.</p>

        <form onSubmit={upload} className="bg-[#121212] border border-white/10 rounded-xl p-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold">Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Summertime Sadness" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-bold">Artist * (Lana Del Rey / The Weeknd / Billie Eilish)</label>
            <input value={artist} onChange={e=>setArtist(e.target.value)} placeholder="Lana Del Rey" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="text-xs font-bold">Album</label>
            <input value={album} onChange={e=>setAlbum(e.target.value)} placeholder="Born To Die" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold">Genre</label>
            <input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Alt Pop" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold">Cover Image * (exact album art, 600x600)</label>
            <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold">Audio MP3 * (complete song, not preview)</label>
            <input type="file" accept="audio/*" onChange={e=>setAudioFile(e.target.files?.[0]||null)} className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm" required />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 mt-2">
            <button type="submit" disabled={loading} className="bg-green-500 text-black font-black px-6 py-3 rounded-full disabled:opacity-50">{loading?"Uploading...":"Add complete song"}</button>
            {msg && <span className="text-sm text-zinc-400">{msg}</span>}
          </div>
        </form>

        <h2 className="text-lg font-bold mt-8 mb-3">Current library ({songs.length}) — click to preview, delete if random</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.map((s:any)=> (
            <div key={s._id} className="bg-zinc-900 rounded-lg p-3">
              <img src={s.coverUrl} alt="" className="w-full aspect-square rounded object-cover bg-zinc-800"/>
              <p className="text-sm font-semibold truncate mt-2">{s.title}</p>
              <p className="text-xs text-zinc-400 truncate">{s.artist}</p>
              <div className="flex gap-2 mt-2">
                <audio controls src={s.audioUrl} className="w-full h-8"/>
              </div>
              <button onClick={()=>del(s._id)} className="mt-2 w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-1.5 rounded text-xs font-bold">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
