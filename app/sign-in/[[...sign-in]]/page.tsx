"use client";
import { useState } from "react";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomSignIn() {
  const { isLoaded, signIn } = useSignIn() as any;
  const { setActive } = useClerk() as any;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setErr(""); setLoading(true);
    try {
      const res: any = await (signIn as any).create({ identifier: email, password });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/");
      } else {
        setErr("Check email verification.");
      }
    } catch (e: any) { setErr(e.errors?.[0]?.message || "Sign in failed"); }
    setLoading(false);
  };

  const oauth = async (strategy: "oauth_google" | "oauth_github" | "oauth_apple") => {
    if (!isLoaded || !signIn) return;
    await (signIn as any).authenticateWithRedirect({ strategy, redirectUrl: "/sso-callback", redirectUrlComplete: "/" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" style={{ perspective: "1200px" }}>
        <div className="absolute top-20 left-[8%] w-40 h-40 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700 shadow-2xl flex items-center justify-center" style={{ transform: "rotateY(25deg) rotateX(10deg)" }}>
          <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-black" />
        </div>
        <div className="absolute top-24 right-1/2 translate-x-32 flex gap-3" style={{ transform: "rotateY(-12deg) rotateX(5deg)" }}>
          {[1,2,3].map((i) => (
            <div key={i} className="w-32 h-32 rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-zinc-800" style={{ transform: `translateZ(${i*12}px)` }}>
              <img src={`https://picsum.photos/seed/lana${i}/300/300`} alt="" className="w-full h-full object-cover opacity-90" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <Link href="/" className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">♫</div><span className="text-2xl font-bold">Music</span></Link>
        <h1 className="text-5xl xl:text-6xl font-black leading-[0.9]">Feel the<br /><span className="text-green-500">Music.</span></h1>
        <p className="mt-4 text-zinc-400 text-lg max-w-md">Custom premium auth • Your library, your vibe. Lana • Weeknd • Billie — 18 complete tracks.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-[420px] bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black">Welcome back</h2>
          <p className="text-sm text-zinc-400 mt-1">Sign in to your premium account</p>

          <div className="grid grid-cols-3 gap-2 mt-6">
            <button onClick={()=>oauth("oauth_google")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">Google</button>
            <button onClick={()=>oauth("oauth_github")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">GitHub</button>
            <button onClick={()=>oauth("oauth_apple")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">Apple</button>
          </div>
          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-white/10"/><span className="text-xs text-zinc-500">or</span><div className="flex-1 h-px bg-white/10"/></div>

          <form onSubmit={handle} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-zinc-300">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@music.com" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            {err && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">{err}</p>}
            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-black rounded-full py-3 mt-2 disabled:opacity-50">
              {loading ? "..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">No account? <Link href="/sign-up" className="text-green-500 hover:text-green-400 font-semibold">Create one</Link></p>
          <p className="text-center text-xs text-zinc-600 mt-3"><Link href="/" className="hover:text-zinc-400">← Back to music</Link></p>
        </div>
      </div>
    </div>
  );
}
