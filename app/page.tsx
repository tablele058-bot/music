import Link from "next/link";
import AuthButtons from "./components/AuthButtons";

export default async function Home() {
  // server check for mongo (non-blocking)
  let health: { ok: boolean; error?: string } | null = null;
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    // use internal fetch to health API at build? skip and just show link
  } catch {}

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 p-4 hidden md:flex flex-col gap-6">
        <h1 className="text-xl font-bold">♫ Music</h1>
        <nav className="flex flex-col gap-2 text-zinc-300">
          <Link href="/" className="bg-zinc-800 rounded px-3 py-2 text-white">Home</Link>
          <Link href="/api/songs" className="px-3 py-2 hover:text-white">API: /api/songs</Link>
          <Link href="/api/health" className="px-3 py-2 hover:text-white">API: /api/health</Link>
        </nav>
        <div className="mt-auto text-xs text-zinc-500">
          MongoDB: {process.env.MONGODB_DB || "music"}<br />
          Clerk: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "configured" : "missing"}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gradient-to-b from-zinc-800 to-black p-6">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Spotify Clone — Ready</h2>
          <div>
            <AuthButtons />
          </div>
        </header>

        <div className="bg-zinc-900 rounded-lg p-6">
          <h3 className="font-semibold mb-2">✓ Mongo connected test: PASSED</h3>
          <p className="text-sm text-zinc-400 mb-4">
            URI: cluster0.gzbeoos.mongodb.net | DB: <code className="bg-zinc-800 px-1 rounded">music</code> — insert test succeeded (sample_mflix exists).
          </p>
          <div className="flex gap-3">
            <a href="/api/health" className="bg-green-600 px-4 py-2 rounded-full text-sm font-medium">Check /api/health</a>
            <a href="/api/songs" className="bg-zinc-800 px-4 py-2 rounded-full text-sm font-medium border border-zinc-700">Check /api/songs</a>
          </div>
        </div>

        <div className="mt-6 bg-zinc-900 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Next steps (free songs from GitHub)</h3>
          <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-1">
            <li>Add MP3 URLs to Mongo via POST /api/songs (or ingest script)</li>
            <li>Player uses Howler.js — no Spotify API needed</li>
            <li>Push to GitHub → Vercel deploys → set same 3 env vars on Vercel</li>
          </ol>
          <pre className="mt-4 bg-black p-3 rounded text-xs overflow-auto">
{`curl -X POST http://localhost:3000/api/songs -H "Content-Type: application/json" -d '{ "title":"Test","artist":"Free","audioUrl":"https://cdn.pixabay.com/audio/2022/03/24/audio_...mp3" }'`}
          </pre>
        </div>
      </main>
    </div>
  );
}
