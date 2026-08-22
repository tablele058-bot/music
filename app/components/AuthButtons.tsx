"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <div className="h-8 w-20 animate-pulse bg-zinc-800 rounded-full" />;
  if (isSignedIn) return <UserButton />;
  return (
    <SignInButton mode="modal">
      <button className="bg-white text-black px-7 py-2 rounded-full font-bold text-sm hover:scale-105 transition">
        Log in
      </button>
    </SignInButton>
  );
}
