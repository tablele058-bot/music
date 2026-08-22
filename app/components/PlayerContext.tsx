"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

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
  const rafRef = useRef<number | null>(null);

  const current = idx >= 0 && queue[idx] ? queue[idx] : null;

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (howlRef.current) {
      howlRef.current.off();
      howlRef.current.unload();
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

  const playAt = useCallback(
    (i: number) => {
      if (i < 0 || i >= queue.length) return;
      cleanup();
      const track = queue[i];
      const howl = new Howl({
        src: [track.audioUrl],
        html5: true, // stream big files
        volume,
        onplay: () => {
          setDuration(howl.duration() || track.duration || 0);
          setIsPlaying(true);
          tick();
        },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => {
          if (repeat) {
            howl.seek(0);
            howl.play();
          } else if (shuffle) {
            const n = Math.floor(Math.random() * queue.length);
            playAt(n);
          } else {
            if (i + 1 < queue.length) playAt(i + 1);
            else setIsPlaying(false);
          }
        },
        onloaderror: (_, err) => {
          console.error("howl load error", err);
          setIsPlaying(false);
        },
        onplayerror: (_, err) => {
          console.error("play error", err);
          setIsPlaying(false);
        },
      });
      howlRef.current = howl;
      setIdx(i);
      howl.play();
    },
    [queue, volume, repeat, shuffle, cleanup, tick]
  );

  const play = useCallback(
    (track: Track, q?: Track[]) => {
      const nextQueue = q ?? queue;
      // if queue not set, build from single + keep others
      if (q) {
        setQueue(q);
        const i = q.findIndex((t) => t._id === track._id || t.audioUrl === track.audioUrl);
        // defer to next tick so queue state updates
        setTimeout(() => playAt(i >= 0 ? i : 0), 0);
      } else {
        // if no queue yet, use single
        if (nextQueue.length === 0) {
          setQueue([track]);
          setTimeout(() => playAt(0), 0);
        } else {
          const i = nextQueue.findIndex((t) => t._id === track._id);
          if (i >= 0) playAt(i);
          else {
            const nq = [...nextQueue, track];
            setQueue(nq);
            setTimeout(() => playAt(nq.length - 1), 0);
          }
        }
      }
    },
    [queue, playAt]
  );

  const toggle = useCallback(() => {
    const h = howlRef.current;
    if (!h) {
      if (current) playAt(idx);
      return;
    }
    if (h.playing()) {
      h.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      h.play();
      setIsPlaying(true);
      tick();
    }
  }, [current, idx, playAt, tick]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    if (shuffle) {
      playAt(Math.floor(Math.random() * queue.length));
    } else {
      playAt((idx + 1) % queue.length);
    }
  }, [idx, queue.length, shuffle, playAt]);

  const prev = useCallback(() => {
    if (!howlRef.current) return;
    if ((howlRef.current.seek() as number) > 3) {
      howlRef.current.seek(0);
      return;
    }
    playAt((idx - 1 + queue.length) % queue.length);
  }, [idx, queue.length, playAt]);

  const seek = useCallback((p: number) => {
    if (howlRef.current) {
      howlRef.current.seek(p);
      setProgress(p);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (howlRef.current) howlRef.current.volume(v);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // init queue if empty later
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
