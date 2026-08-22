"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayerProvider, usePlayer, type Track } from "../components/PlayerContext";
import { Icons } from "../components/SpotifyIcons";
import AuthButtons from "../components/AuthButtons";

function SearchInner() {
  const [q, setQ] = useState("");
  const [songs, setSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { play, current, isPlaying } = usePlayer();

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/songs${q ? `?q=${encodeURIComponent(q)}` : ""}`);
        const j = await res.json();
        if (j.ok) {
          const mapped: Track[] = j.songs.map((s: any) => ({
            _id: s._id,
            title: s.title,
            artist: s.artist,
            album: s.album,
            coverUrl: s.coverUrl,
            audioUrl: s.audioUrl,
            duration: s.duration,
          }));
          setSongs(mapped);
        }
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-20 bg-black border-b border-white/10 px-4 md:px-6 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold"><span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">♫</span> Music</Link>
        <div className="flex-1 max-w-xl relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="What do you want to play? (Lana, Weeknd, Billie...)" className="w-full bg-[#242424] rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:bg-[#2a2a2a] border border-transparent focus:border-white/10" />
        </div>
        <div className="hidden md:block"><AuthButtons /></div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden md:flex w-[280px] xl:w-[340px] bg-black p-2 flex-col gap-2">
          <div className="bg-[#121212] rounded-lg p-2">
            <Link href="/" className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white"><Icons.Home className="h-6 w-6"/> Home</Link>
            <Link href="/search" className="flex items-center gap-4 px-3 py-2 bg-white/10 rounded text-white font-semibold"><Icons.Search className="h-6 w-6"/> Search</Link>
            <Link href="/" className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white"><Icons.Library className="h-6 w-6"/> Your Library</Link>
          </div>
          <div className="bg-[#121212] rounded-lg p-4 flex-1">
            <p className="text-sm font-bold">Browse categories</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Lana Del Rey","The Weeknd","Billie Eilish","Pop","Rock","Chill"].map(c=> <button key={c} onClick={()=>setQ(c)} className="text-left bg-zinc-800 hover:bg-zinc-700 rounded p-3 text-sm font-semibold">{c}</button>)}
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#121212] md:rounded-lg m-0 md:m-2 p-4 md:p-6 overflow-auto">
          {loading ? <p className="text-zinc-500">Searching…</p> : (
            <>
              <h2 className="text-xl font-bold mb-4">{q ? `Results for "${q}"` : "Browse all"} <span className="text-zinc-500 font-normal text-sm">({songs.length})</span></h2>
              {songs.length===0 ? <p className="text-zinc-500 text-sm">No songs. Try &quot;Lana&quot; or &quot;Weeknd&quot;.</p> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {songs.map(s=> {
                    const active = current?._id===s._id;
                    return (
                      <div key={s._id} onClick={()=>play(s, songs)} className={`group bg-zinc-900 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer ${active? "ring-1 ring-white/10 bg-zinc-800": ""}`}>
                        <div className="relative">
                          <img src={s.coverUrl} alt={s.title} className="aspect-square rounded-md object-cover w-full bg-zinc-800"/>
                          <button className={`absolute bottom-2 right-2 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition ${active && isPlaying ? "!opacity-100": ""}`}>
                            {active && isPlaying ? <Icons.Pause className="h-5 w-5 text-black"/> : <Icons.Play className="h-5 w-5 text-black ml-0.5"/>}
                          </button>
                        </div>
                        <p className="text-sm font-semibold truncate mt-3">{s.title}</p>
                        <p className="text-xs text-zinc-400 truncate">{s.artist}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchClient() {
  // wrap with player so search can play
  return <PlayerProvider><SearchInner /></PlayerProvider>;
}
