"use client";
import { useEffect, useState } from "react";
import AuthButtons from "./AuthButtons";
import { PlayerProvider, usePlayer, type Track } from "./PlayerContext";
import { Icons } from "./SpotifyIcons";

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function PlayerBar() {
  const { current, isPlaying, progress, duration, volume, shuffle, repeat, toggle, next, prev, seek, setVolume, setShuffle, setRepeat } = usePlayer();
  if (!current) {
    return (
      <div className="h-[80px] bg-black border-t border-white/10 flex items-center justify-center text-zinc-500 text-sm px-4">Select a song to play</div>
    );
  }
  return (
    <div className="h-[80px] md:h-[88px] bg-black border-t border-white/10 flex items-center px-2 md:px-4 gap-2 md:gap-4">
      {/* left */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        <img src={current.coverUrl} alt="" className="h-11 w-11 md:h-14 md:w-14 rounded object-cover bg-zinc-800" />
        <div className="min-w-0 hidden sm:block">
          <p className="text-sm font-medium truncate leading-tight">{current.title}</p>
          <p className="text-xs text-zinc-400 truncate">{current.artist}</p>
        </div>
        <button className="hidden md:block ml-2 text-zinc-400 hover:text-white"><Icons.Heart className="h-4 w-4" /></button>
      </div>
      {/* center */}
      <div className="flex flex-col items-center flex-1 max-w-[480px] gap-1">
        <div className="flex items-center gap-3 md:gap-5">
          <button onClick={() => setShuffle(!shuffle)} className={`hidden md:block ${shuffle ? "text-green-500" : "text-zinc-400 hover:text-white"}`}><Icons.Shuffle className="h-4 w-4" /></button>
          <button onClick={prev} className="text-zinc-400 hover:text-white"><Icons.Prev className="h-5 w-5" /></button>
          <button onClick={toggle} className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition">
            {isPlaying ? <Icons.Pause className="h-4 w-4 ml-0" /> : <Icons.Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={next} className="text-zinc-400 hover:text-white"><Icons.Next className="h-5 w-5" /></button>
          <button onClick={() => setRepeat(!repeat)} className={`hidden md:block ${repeat ? "text-green-500" : "text-zinc-400 hover:text-white"}`}><Icons.Repeat className="h-4 w-4" /></button>
        </div>
        <div className="hidden md:flex items-center gap-2 w-full">
          <span className="text-[11px] text-zinc-400 w-10 text-right">{formatTime(progress)}</span>
          <div className="flex-1 group">
            <input type="range" min={0} max={duration || 100} value={progress} onChange={(e) => seek(parseFloat(e.target.value))} className="w-full accent-white group-hover:accent-green-500 h-1" />
          </div>
          <span className="text-[11px] text-zinc-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>
      {/* right */}
      <div className="hidden md:flex items-center gap-3 w-[30%] justify-end">
        <Icons.Volume className="h-4 w-4 text-zinc-400" />
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 accent-white h-1" />
      </div>
      {/* mobile progress overlay */}
      <div className="md:hidden absolute left-0 right-0 bottom-[56px] h-1 bg-white/10">
        <div className="h-full bg-white" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

function SongGrid({ songs }: { songs: Track[] }) {
  const { play, current, isPlaying } = usePlayer();
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Music", "Podcasts"];
  return (
    <>
      <div className="flex gap-2 mb-5">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === c ? "bg-white text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}>{c}</button>
        ))}
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-4">Made For You</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
        {songs.map((s) => {
          const active = current?._id === s._id;
          return (
            <div key={s._id} onClick={() => play(s, songs)} className={`group bg-zinc-900/70 hover:bg-zinc-800 p-3 rounded-lg cursor-pointer transition ${active ? "bg-zinc-800 ring-1 ring-white/10" : ""}`}>
              <div className="relative">
                <img src={s.coverUrl} alt={s.title} className="aspect-square rounded-md object-cover bg-zinc-800 w-full" />
                <button className={`absolute bottom-2 right-2 h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition ${active && isPlaying ? "opacity-100 translate-y-0" : ""}`}>
                  {active && isPlaying ? <Icons.Pause className="h-5 w-5 text-black" /> : <Icons.Play className="h-5 w-5 text-black ml-0.5" />}
                </button>
              </div>
              <p className="text-sm font-semibold truncate mt-3 leading-tight">{s.title}</p>
              <p className="text-xs text-zinc-400 truncate">{s.artist} • {s.album}</p>
            </div>
          );
        })}
      </div>
      <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">Recently Played</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {[...songs].reverse().map((s) => (
          <div key={"r"+s._id} onClick={() => play(s, songs)} className="min-w-[160px] bg-zinc-900 rounded-md p-3 cursor-pointer hover:bg-zinc-800">
            <img src={s.coverUrl} alt="" className="h-32 w-40 object-cover rounded" />
            <p className="text-sm font-medium truncate mt-2">{s.title}</p>
            <p className="text-xs text-zinc-400 truncate">{s.artist}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Sidebar({ onPlay }: { onPlay?: () => void }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="bg-[#121212] rounded-lg p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-white font-bold"><span className="text-xl">●</span> Spotify</div>
        <nav className="mt-2 flex flex-col">
          <a className="flex items-center gap-4 px-3 py-2 bg-white/10 rounded font-semibold text-white"><Icons.Home className="h-6 w-6" /> Home</a>
          <a className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white"><Icons.Search className="h-6 w-6" /> Search</a>
          <a className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:text-white"><Icons.Library className="h-6 w-6" /> Your Library</a>
        </nav>
      </div>
      <div className="bg-[#121212] rounded-lg p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-zinc-300">Your Library</span>
          <button className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400"><Icons.Plus className="h-4 w-4" /></button>
        </div>
        <div className="bg-[#242424] rounded-lg p-4 mb-3">
          <p className="text-sm font-bold">Create your first playlist</p>
          <p className="text-xs text-white/70 mt-1">It&apos;s easy, we&apos;ll help you</p>
          <button className="mt-3 bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">Create playlist</button>
        </div>
        <div className="bg-[#242424] rounded-lg p-4">
          <p className="text-sm font-bold">Let&apos;s find some podcasts</p>
          <p className="text-xs text-white/70 mt-1">We&apos;ll keep you updated</p>
          <button className="mt-3 bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">Browse podcasts</button>
        </div>
        <div className="mt-auto text-[11px] text-zinc-500 flex flex-wrap gap-3 pt-4">
          <span>Legal</span><span>Privacy</span><span>Cookies</span>
        </div>
      </div>
    </div>
  );
}

export default function SpotifyApp({ initialSongs }: { initialSongs: Track[] }) {
  const [isMobileLibraryOpen, setIsMobileLibraryOpen] = useState(false);
  return (
    <PlayerProvider>
      <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex flex-1 gap-2 p-2 overflow-hidden">
          <aside className="w-[280px] xl:w-[350px] shrink-0 overflow-hidden"><Sidebar /></aside>
          <main className="flex-1 bg-[#121212] rounded-lg flex flex-col overflow-hidden">
            {/* header */}
            <header className="flex items-center justify-between px-6 py-3 bg-[#121212]/80 backdrop-blur sticky top-0 z-10">
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full bg-black/70 flex items-center justify-center">‹</button>
                <button className="h-8 w-8 rounded-full bg-black/70 flex items-center justify-center opacity-50">›</button>
              </div>
              <div className="flex items-center gap-2">
                <a href="#" className="hidden lg:block bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">Explore Premium</a>
                <AuthButtons />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <SongGrid songs={initialSongs} />
            </div>
          </main>
        </div>
        {/* MOBILE LAYOUT */}
        <div className="md:hidden flex-1 bg-[#121212] overflow-y-auto">
          <header className="sticky top-0 z-10 bg-[#121212] flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 font-bold"><span className="text-xl">●</span> Spotify</div>
            <AuthButtons />
          </header>
          <div className="px-4 pb-24">
            <SongGrid songs={initialSongs} />
          </div>
          <nav className="fixed bottom-[80px] left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 flex items-center justify-around px-4 border-t border-white/5 bg-black/95">
            <button className="flex flex-col items-center text-white"><Icons.Home className="h-6 w-6" /><span className="text-[10px]">Home</span></button>
            <button className="flex flex-col items-center text-zinc-400" onClick={() => setIsMobileLibraryOpen(!isMobileLibraryOpen)}><Icons.Library className="h-6 w-6" /><span className="text-[10px]">Library</span></button>
            <button className="flex flex-col items-center text-zinc-400"><Icons.Search className="h-6 w-6" /><span className="text-[10px]">Search</span></button>
          </nav>
          {isMobileLibraryOpen && (
            <div className="fixed inset-0 bg-black/80 z-20 p-4" onClick={() => setIsMobileLibraryOpen(false)}>
              <div className="bg-[#121212] rounded-lg p-4 mt-12" onClick={(e) => e.stopPropagation()}><Sidebar /></div>
            </div>
          )}
        </div>
        <div className="shrink-0"><PlayerBarWrapper /></div>
      </div>
    </PlayerProvider>
  );
}

function PlayerBarWrapper() {
  return <PlayerBar />;
}
