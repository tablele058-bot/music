"use client";
export default function AuthButtons() {
  // Clerk SignedIn/SignedOut is currently incompatible with Next 16 prerender in build.
  // Use plain button that routes to /sign-in (Clerk will handle). UserButton rendered client-side after hydration via dynamic import if needed.
  return (
    <a href="/sign-in" className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition inline-block">
      Log in
    </a>
  );
}
