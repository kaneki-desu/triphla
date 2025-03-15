import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ClerkProvider, SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* <link rel="icon" href="/dall.png" /> */}
          <title>Triphla</title>
        </head>
        {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
        <body className="pr-8 bg-slate-900">
          <header>
            <nav className="flex justify-between">
              <div className="my-10 ml-10 bg-white w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/dall.png"
                  alt="Triphla Logo"
                  width={128}
                  height={128}
                />
              </div>
              <div className="py-11 flex space-x-14 px-16">
                <Link href="/" className="pt-1 text-white hover:text-slate-300">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="pt-1 text-white hover:text-slate-300"
                >
                  Dashboard
                </Link>
                <Link href="/about" className="pt-1 text-white hover:text-slate-300">
                  About
                </Link>
                <div className="flex space-x-4">
                  <SignedOut>
                    <SignInButton className="text-white hover:text-slate-300" mode="modal"/>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
                
              </div>
            </nav>
          </header>
          {children}
          <footer className="text-center text-white mt-20">
            <p>&copy; 2021 Triphla</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
