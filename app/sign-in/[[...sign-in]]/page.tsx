import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      {/* 3D Background Layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Floating 3D Vinyl Records - CSS 3D */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" style={{ perspective: "1200px" }}>
        <div className="absolute top-20 left-[8%] w-40 h-40 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700 shadow-2xl flex items-center justify-center" style={{ transform: "rotateY(25deg) rotateX(10deg)", transformStyle: "preserve-3d" }}>
          <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-black" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent" />
        </div>
        <div className="absolute bottom-32 left-[18%] w-28 h-28 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700 shadow-2xl flex items-center justify-center animate-[float_6s_ease-in-out_infinite]" style={{ transform: "rotateY(-15deg)" }}>
          <div className="w-8 h-8 rounded-full bg-purple-500" />
        </div>
        <div className="absolute top-1/3 right-[38%] w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700 shadow-2xl flex items-center justify-center animate-[float_8s_ease-in-out_infinite_1s]" style={{ transform: "rotateY(20deg) rotateX(-10deg)" }}>
          <div className="w-10 h-10 rounded-full bg-green-500" />
        </div>
        {/* Stacked album covers 3D */}
        <div className="absolute top-24 right-1/2 translate-x-32 flex gap-3" style={{ transform: "rotateY(-12deg) rotateX(5deg)", transformStyle: "preserve-3d" }}>
          {[1,2,3].map((i) => (
            <div key={i} className="w-32 h-32 rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-zinc-800" style={{ transform: `translateZ(${i*12}px)`, }} >
              <img src={`https://picsum.photos/seed/lana${i}/300/300`} alt="" className="w-full h-full object-cover opacity-90" />
            </div>
          ))}
        </div>
      </div>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">♫</div>
          <span className="text-2xl font-bold tracking-tight">Music</span>
        </div>
        <h1 className="text-5xl xl:text-6xl font-black leading-[0.9] tracking-tight">
          Feel the<br />
          <span className="text-green-500">Music.</span>
        </h1>
        <p className="mt-4 text-zinc-400 text-lg max-w-md leading-relaxed">
          Lana Del Rey • The Weeknd • Billie Eilish — 18 tracks, local playback, no ads. Your library, your vibe.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3].map(i=> <img key={i} src={`https://picsum.photos/seed/weeknd${i}/100/100`} alt="" className="w-10 h-10 rounded-full border-2 border-black object-cover"/>)}
          </div>
          <span className="text-sm text-zinc-500">18 songs • 3 artists • 100% local</span>
        </div>
      </div>

      {/* Right SignIn Card */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black">♫</div>
            <span className="font-bold">Music</span>
          </div>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#121212] border border-white/10 shadow-2xl rounded-2xl",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton: "bg-zinc-800 border-white/10 text-white hover:bg-zinc-700",
                formFieldLabel: "text-zinc-300",
                formFieldInput: "bg-zinc-900 border-white/10 text-white rounded-lg",
                formButtonPrimary: "bg-green-500 hover:bg-green-400 text-black font-bold rounded-full",
                footerActionLink: "text-green-500 hover:text-green-400",
                identityPreviewText: "text-white",
                formFieldAction: "text-zinc-400",
              },
            }}
          />
          <p className="text-center text-xs text-zinc-600 mt-4">Demo auth • Clerk • MongoDB non-SRV • Howler.js</p>
        </div>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0) rotateY(-15deg)} 50%{transform:translateY(-16px) rotateY(-15deg)} }`}</style>
    </div>
  );
}
