"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";

export type Track = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
};

type Ctx = {
  queue: Track[];
  current: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (p: number) => void;
  setVolume: (v: number) => void;
  setShuffle: (b: boolean) => void;
  setRepeat: (b: boolean) => void;
};

const PlayerCtx = createContext<Ctx | null>(null);

export function usePlayer() {
  const c = useContext(PlayerCtx);
  if (!c) throw new Error("usePlayer outside provider");
  return c;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [idx, setIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const howlRef = useRef<Howl | null>(null);
  const queueRef = useRef<Track[]>([]);
  const idxRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);

  // keep refs in sync
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { idxRef.current = idx; }, [idx]);

  const current = idx >= 0 && queue[idx] ? queue[idx] : null;

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (howlRef.current) {
      try { howlRef.current.off(); } catch {}
      try { howlRef.current.unload(); } catch {}
      howlRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const h = howlRef.current;
    if (h && h.playing()) {
      setProgress(h.seek() as number);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // unlock AudioContext on first user gesture (Chrome autoplay policy)
  const unlock = useCallback(() => {
    try {
      const ctx = (Howler as any).ctx as AudioContext | undefined;
      if (ctx && ctx.state === "suspended") ctx.resume();
    } catch {}
  }, []);

  const playAt = useCallback(
    (i: number, qOverride?: Track[]) => {
      const q = qOverride ?? queueRef.current;
      if (i < 0 || i >= q.length) return;
      unlock();
      cleanup();
      const track = q[i];
      // ensure queue/index are set BEFORE creating Howl so next/prev work
      if (qOverride) setQueue(qOverride);
      setIdx(i);
      idxRef.current = i;
      queueRef.current = q;

      const howl = new Howl({
        src: [track.audioUrl],
        html5: true,
        preload: true,
        volume,
        onplay: () => {
          setDuration(howl.duration() || track.duration || 0);
          setIsPlaying(true);
          tick();
        },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => {
          const curIdx = idxRef.current;
          const curQueue = queueRef.current;
          if (repeat) {
            howl.seek(0);
            howl.play();
          } else if (shuffle) {
            const n = Math.floor(Math.random() * curQueue.length);
            playAt(n);
          } else {
            if (curIdx + 1 < curQueue.length) playAt(curIdx + 1);
            else setIsPlaying(false);
          }
        },
        onloaderror: (_id, err) => {
          console.error("howl load error", err, track.audioUrl);
          setIsPlaying(false);
        },
        onplayerror: (_id, err) => {
          console.error("play error", err);
          // try unlock and retry once (Chrome requires user gesture)
          unlock();
          const h = howlRef.current;
          if (h) {
            // Howler will emit unlock event and retry
            (h as any).once?.("unlock", () => h.play());
          }
          setIsPlaying(false);
        },
      });
      howlRef.current = howl;
      // MUST be called synchronously within the same click stack
      const playResult = howl.play();
      // Howl returns soundId or undefined if blocked; unlock will handle retry via onplayerror
      if (playResult === undefined) {
        // html5 fallback - still set playing optimistically
        setIsPlaying(true);
      }
    },
    [volume, repeat, shuffle, cleanup, tick, unlock]
  );

  const play = useCallback(
    (track: Track, q?: Track[]) => {
      unlock();
      const nextQueue = q ?? queueRef.current;
      if (q) {
        const i = q.findIndex((t) => t._id === track._id || t.audioUrl === track.audioUrl);
        playAt(i >= 0 ? i : 0, q);
      } else {
        if (nextQueue.length === 0) {
          playAt(0, [track]);
        } else {
          const i = nextQueue.findIndex((t) => t._id === track._id);
          if (i >= 0) playAt(i);
          else {
            const nq = [...nextQueue, track];
            playAt(nq.length - 1, nq);
          }
        }
      }
    },
    [playAt, unlock]
  );

  const toggle = useCallback(() => {
    unlock();
    const h = howlRef.current;
    if (!h) {
      if (current) playAt(idxRef.current);
      return;
    }
    if (h.playing()) {
      h.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      // resume suspended context if needed
      const ctx = (Howler as any).ctx as AudioContext | undefined;
      if (ctx && ctx.state === "suspended") ctx.resume().then(() => h.play());
      else h.play();
      setIsPlaying(true);
      tick();
    }
  }, [current, playAt, tick, unlock]);

  const next = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    unlock();
    if (shuffle) playAt(Math.floor(Math.random() * q.length));
    else playAt((idxRef.current + 1) % q.length);
  }, [shuffle, playAt, unlock]);

  const prev = useCallback(() => {
    if (!howlRef.current) return;
    unlock();
    if ((howlRef.current.seek() as number) > 3) {
      howlRef.current.seek(0);
      return;
    }
    playAt((idxRef.current - 1 + queueRef.current.length) % queueRef.current.length);
  }, [playAt, unlock]);

  const seek = useCallback((p: number) => {
    if (howlRef.current) {
      howlRef.current.seek(p);
      setProgress(p);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (howlRef.current) howlRef.current.volume(v);
    Howler.volume(v);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // global unlock on first click (helps Chrome)
  useEffect(() => {
    const handler = () => unlock();
    window.addEventListener("click", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [unlock]);

  return (
    <PlayerCtx.Provider
      value={{
        queue,
        current,
        isPlaying,
        progress,
        duration,
        volume,
        shuffle,
        repeat,
        play: play as Ctx["play"],
        toggle,
        next,
        prev,
        seek,
        setVolume,
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerCtx.Provider>
  );
}
