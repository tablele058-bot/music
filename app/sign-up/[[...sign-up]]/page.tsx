"use client";
import { useState } from "react";
import { useSignUp, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp() as any;
  const { setActive } = useClerk() as any;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setErr(""); setLoading(true);
    try {
      await (signUp as any).create({ emailAddress: email, password });
      await (signUp as any).prepareEmailAddressVerification({ strategy: "email_code" });
      setPending(true);
    } catch (e: any) { setErr(e.errors?.[0]?.message || "Sign up failed"); }
    setLoading(false);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    try {
      const res: any = await (signUp as any).attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/");
      }
    } catch (e: any) { setErr(e.errors?.[0]?.message || "Verification failed"); }
    setLoading(false);
  };

  const oauth = async (strategy: "oauth_google" | "oauth_github" | "oauth_apple") => {
    if (!isLoaded || !signUp) return;
    await (signUp as any).authenticateWithRedirect({ strategy, redirectUrl: "/sso-callback", redirectUrlComplete: "/" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <Link href="/" className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">♫</div><span className="text-2xl font-bold">Music</span></Link>
        <h1 className="text-5xl xl:text-6xl font-black leading-[0.9]">Join the<br /><span className="text-pink-500">Sound.</span></h1>
        <p className="mt-4 text-zinc-400 text-lg max-w-md">Create your premium library — custom auth, full tracks, dark/light mode.</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-[420px] bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {!pending ? (
            <>
              <h2 className="text-2xl font-black">Create account</h2>
              <p className="text-sm text-zinc-400 mt-1">Premium • Custom design • No Clerk default</p>
              <div className="grid grid-cols-3 gap-2 mt-6">
                <button onClick={()=>oauth("oauth_google")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">Google</button>
                <button onClick={()=>oauth("oauth_github")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">GitHub</button>
                <button onClick={()=>oauth("oauth_apple")} className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg py-2.5 text-sm font-semibold">Apple</button>
              </div>
              <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-white/10"/><span className="text-xs text-zinc-500">or</span><div className="flex-1 h-px bg-white/10"/></div>
              <form onSubmit={handle} className="space-y-3">
                <div><label className="text-xs font-bold text-zinc-300">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@music.com" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" /></div>
                <div><label className="text-xs font-bold text-zinc-300">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="••••••••" className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" /></div>
                {err && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">{err}</p>}
                <button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-400 text-black font-black rounded-full py-3 mt-2 disabled:opacity-50">{loading?"...":"Create account"}</button>
              </form>
              <p className="text-center text-sm text-zinc-500 mt-6">Have account? <Link href="/sign-in" className="text-pink-500 font-semibold">Sign in</Link></p>
            </>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <h2 className="text-2xl font-black">Verify email</h2>
              <p className="text-sm text-zinc-400">Code sent to {email}</p>
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" />
              {err && <p className="text-xs text-red-400">{err}</p>}
              <button type="submit" disabled={loading} className="w-full bg-pink-500 text-black font-black rounded-full py-3 disabled:opacity-50">{loading?"...":"Verify"}</button>
            </form>
          )}
          <p className="text-center text-xs text-zinc-600 mt-4"><Link href="/" className="hover:text-zinc-400">← Back to music</Link></p>
        </div>
      </div>
    </div>
  );
}
