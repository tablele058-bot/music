"use client";
import { useState } from "react";
import { usePlayer, type Track } from "./PlayerContext";
import { Icons } from "./SpotifyIcons";

type Playlist = { _id:string; name:string; coverUrl:string; type:string; songs:any[] };

export default function SongDetail({
  track,
  onClose,
  playlists,
  onAddToPlaylist,
  allTracks,
}: {
  track: Track;
  onClose: () => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId:string, songId:string)=>void;
  allTracks: Track[];
}) {
  const { play, current, isPlaying, toggle } = usePlayer();
  const [showAdd, setShowAdd] = useState(false);
  const isCurrent = current?._id === track._id;
  const nextTracks = allTracks.filter(t=> t.artist===track.artist).slice(0,4);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 via-[#121212] to-black h-[340px] pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <button onClick={onClose} className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80">✕</button>
        <div className="flex gap-2">
          <button onClick={()=>setShowAdd(!showAdd)} className="hidden md:flex bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">Add to playlist</button>
          <button onClick={()=> play(track, allTracks)} className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-black"><Icons.Play className="h-5 w-5 ml-0.5"/></button>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-2 md:py-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-end">
            <div className="w-full md:w-[232px] shrink-0">
              <img src={track.coverUrl} alt={track.title} className="w-full aspect-square object-cover rounded-md shadow-2xl bg-zinc-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="hidden md:block text-xs font-bold uppercase tracking-widest text-white">Song</p>
              <h1 className="text-3xl md:text-6xl font-black leading-none tracking-tight mt-1">{track.title}</h1>
              <div className="flex items-center gap-2 mt-3 text-sm">
                <img src={track.coverUrl} alt="" className="w-6 h-6 rounded-full"/>
                <span className="font-bold hover:underline cursor-pointer">{track.artist}</span>
                <span className="text-zinc-400">• {track.album} • 2024 • 4 songs, 14 min</span>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <button onClick={()=> isCurrent ? toggle() : play(track, allTracks)} className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition shadow-lg">
                  {isCurrent && isPlaying ? <Icons.Pause className="h-7 w-7"/> : <Icons.Play className="h-7 w-7 ml-1"/>}
                </button>
                <button className="text-zinc-400 hover:text-white"><Icons.Heart className="h-7 w-7"/></button>
                <button className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white">⋯</button>
                <span className="ml-auto hidden md:block text-sm text-zinc-400">~ {Math.floor((track.duration||180)/60)}:{String((track.duration||180)%60).padStart(2,'0')}</span>
              </div>
            </div>
          </div>

          {/* Options like Spotify */}
          <div className="mt-8 bg-black/20 backdrop-blur rounded-lg">
            <div className="flex items-center gap-2 py-2 text-sm text-zinc-400 border-b border-white/5">
              <span className="w-8 text-right">#</span>
              <span className="flex-1">Title</span>
              <span className="hidden md:block w-1/4">Album</span>
              <span className="w-12 flex justify-center">◷</span>
            </div>
            <div className="divide-y divide-white/5">
              <div className={`flex items-center gap-2 p-2 rounded hover:bg-white/10 ${isCurrent ? "bg-white/10" : ""}`}>
                <span className="w-8 text-right text-sm">{isCurrent && isPlaying ? <span className="text-green-500">♫</span> : "1"}</span>
                <img src={track.coverUrl} alt="" className="w-10 h-10 rounded"/>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isCurrent?"text-green-500":"text-white"}`}>{track.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                </div>
                <span className="hidden md:block w-1/4 text-sm text-zinc-400 truncate">{track.album}</span>
                <span className="w-12 text-center text-sm text-zinc-400">{Math.floor((track.duration||180)/60)}:{String((track.duration||180)%60).padStart(2,'0')}</span>
              </div>
            </div>
          </div>

          {/* Add to playlist */}
          <div className="mt-6 bg-zinc-900 rounded-lg p-4">
            <h3 className="font-bold mb-3">Add to playlist / album</h3>
            {playlists.length===0 ? <p className="text-sm text-zinc-500">No playlists yet — create one from Your Library.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {playlists.map(p=> (
                  <button key={p._id} onClick={()=> onAddToPlaylist(p._id, track._id)} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-left">
                    <img src={p.coverUrl} alt="" className="w-12 h-12 rounded object-cover"/>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-zinc-400 capitalize">{p.type} • {p.songs?.length||0}</p>
                    </div>
                    <span className="ml-auto text-green-500 text-xl">+</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More by artist */}
          <div className="mt-8">
            <h3 className="font-bold mb-3">More by {track.artist}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {nextTracks.map(t=> (
                <div key={t._id} onClick={()=> play(t, allTracks)} className="min-w-[140px] bg-zinc-900 p-3 rounded cursor-pointer hover:bg-zinc-800">
                  <img src={t.coverUrl} alt="" className="w-full aspect-square rounded object-cover"/>
                  <p className="text-sm font-semibold truncate mt-2">{t.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{t.artist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
