"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    await signIn("google", {
      callbackUrl: "/learn",
    })
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      // className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
      className="w-full flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-100 cursor-pointer"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="h-5 w-5"/>
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  )
}
