"use client";
import { useState } from "react";

export default function CreatePlaylistModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name:string, type:"playlist"|"album", description:string, coverUrl:string)=>void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [ptype, setPtype] = useState<"playlist"|"album">("playlist");
  const [cover, setCover] = useState("");

  if(!open) return null;
  const submit = () => {
    if(!name.trim()) return;
    onCreate(name.trim(), ptype, desc.trim(), cover.trim());
    setName(""); setDesc(""); setCover("");
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#242424] rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl" onClick={e=>e.stopPropagation()}>
        {/* Top */}
        <div className="h-36 bg-gradient-to-br from-green-600 via-zinc-800 to-black p-6 flex items-end gap-4">
          <div className="w-24 h-24 bg-black/40 rounded-md shadow-xl flex items-center justify-center border border-white/10 overflow-hidden">
            {cover ? <img src={cover} alt="" className="w-full h-full object-cover"/> : <span className="text-3xl">♫</span>}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">{ptype}</p>
            <h2 className="text-2xl font-black leading-tight">{name || `My ${ptype}`}</h2>
            <p className="text-xs text-white/60">Create a new {ptype} • stored in MongoDB</p>
          </div>
        </div>
        {/* Down */}
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <button onClick={()=>setPtype("playlist")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${ptype==="playlist"?"bg-white text-black":"bg-zinc-800 text-zinc-400"}`}>Playlist</button>
            <button onClick={()=>setPtype("album")} className={`flex-1 py-2.5 rounded-full text-sm font-bold ${ptype==="album"?"bg-white text-black":"bg-zinc-800 text-zinc-400"}`}>Album</button>
          </div>
          <label className="text-xs font-bold text-zinc-300">Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={`${ptype} name`} className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20" autoFocus onKeyDown={e=> e.key==="Enter" && submit()} />
          <label className="text-xs font-bold text-zinc-300 mt-4 block">Description</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Add an optional description" rows={2} className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20 resize-none" />
          <label className="text-xs font-bold text-zinc-300 mt-4 block">Cover URL (optional)</label>
          <input value={cover} onChange={e=>setCover(e.target.value)} placeholder="https://..." className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/20" />
          <p className="text-xs text-zinc-500 mt-1">Leave blank for auto generated cover</p>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-3 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700">Cancel</button>
            <button onClick={submit} disabled={!name.trim()} className="flex-1 py-3 rounded-full bg-green-500 text-black font-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-400">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}
