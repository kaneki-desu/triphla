"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeToggleButton } from "./ui/theme-toggle-button";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!navbarRef.current || !logoRef.current || !linksRef.current || !actionsRef.current) return;

    gsap.fromTo(
      navbarRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      linksRef.current.children,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "back.out" }
    );

    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, rotate: -10 },
      { scale: 1, rotate: 0, duration: 0.6, delay: 0.2, ease: "elastic.out(1, 0.3)" }
    );

    gsap.fromTo(
      actionsRef.current.children,
      { opacity: 0, x: 10 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (navbarRef.current) {
        const blurValue = Math.min(scrollY / 40 + 10, 30); // more aggressive blur
        const bgOpacity = Math.min(0.1 + scrollY / 200, 0.3); // subtle opacity
        navbarRef.current.style.backdropFilter = `blur(${blurValue}px)`;
        navbarRef.current.style.backgroundColor = `rgba(18, 18, 20, ${bgOpacity})`; // soft dark frosted
        navbarRef.current.style.boxShadow = `0 2px 20px rgba(0, 0, 0, ${bgOpacity + 0.1})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="flex justify-between items-center px-4 md:px-6 py-2 sticky top-3 z-50 rounded-xl mx-auto max-w-[95%] bg-black/20 border border-border/20 backdrop-blur-xl transition-all duration-300"
    >
      {/* Logo Section */}
      <div ref={logoRef} className="flex items-center px-2 md:px-3">
        <div className="bg-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <Image src="/dall.png" alt="Triphla Logo" width={32} height={32} />
        </div>
        <div className="ml-2 font-semibold text-base md:text-lg text-white hover:text-primary transition-colors duration-300">
          triphla
        </div>
      </div>

      {/* Navigation Links */}
      <div
        ref={linksRef}
        className="hidden md:flex items-center space-x-4 lg:space-x-8"
      >
        {["Home", "Interface", "Dashboard", "Learn", "About"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
            className="text-sm font-medium text-white/80 hover:text-primary transition-all duration-200 hover:scale-105"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Mobile menu button */}
      <button className="md:hidden text-white hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* User Actions */}
      <div ref={actionsRef} className="flex items-center space-x-2 md:space-x-4">
        <SignedOut>
          <div className="rounded-full bg-primary/90 hover:bg-primary px-3 py-1 text-sm text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
            <SignInButton mode="modal">Sign In</SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <ThemeToggleButton />
      </div>
    </nav>
  );
}
