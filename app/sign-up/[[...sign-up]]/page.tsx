import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-black" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block" style={{ perspective: "1200px" }}>
        <div className="absolute top-24 left-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-700 shadow-2xl flex items-center justify-center" style={{ transform: "rotateY(20deg)" }}>
          <div className="w-10 h-10 rounded-full bg-pink-500" />
        </div>
        <div className="absolute bottom-24 left-[20%] w-24 h-24 rounded-lg overflow-hidden shadow-2xl border border-white/10" style={{ transform: "rotateY(-10deg) rotateX(8deg)" }}>
          <img src="https://picsum.photos/seed/billie1/300/300" alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-xl">♫</div><span className="text-2xl font-bold">Music</span></div>
        <h1 className="text-5xl xl:text-6xl font-black leading-[0.9]">Join the<br /><span className="text-pink-500">Sound.</span></h1>
        <p className="mt-4 text-zinc-400 text-lg max-w-md">Create your library — playlists, albums, and local playback in one dark Spotify clone.</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-6"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black">♫</div><span className="font-bold">Music</span></div>
          <SignUp
            appearance={{
              elements: {
                card: "bg-[#121212] border border-white/10 shadow-2xl rounded-2xl",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton: "bg-zinc-800 border-white/10 text-white hover:bg-zinc-700",
                formFieldLabel: "text-zinc-300",
                formFieldInput: "bg-zinc-900 border-white/10 text-white",
                formButtonPrimary: "bg-pink-500 hover:bg-pink-400 text-black font-bold rounded-full",
                footerActionLink: "text-pink-500",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
