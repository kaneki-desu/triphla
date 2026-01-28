"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ThemeToggleButton } from "./ui/theme-toggle-button";
import AudioPlayer from './AudioPlayer';
import LoginModal from "./LoginModal";
import {  signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const actionsRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSession()?.data?.user;
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
        const blurValue = Math.min(scrollY / 40 + 10, 30);
        const bgOpacity = Math.min(0.1 + scrollY / 200, 0.3);
        navbarRef.current.style.backdropFilter = `blur(${blurValue}px)`;
        navbarRef.current.style.backgroundColor = `rgba(18, 18, 20, ${bgOpacity})`;
        navbarRef.current.style.boxShadow = `0 2px 20px rgba(0, 0, 0, ${bgOpacity + 0.1})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Interface", "Dashboard", "Learn", "About"];

  return (
    <nav
      ref={navbarRef}
      className="flex justify-between items-center px-4 md:px-6 py-2 sticky top-3 z-50 rounded-xl mx-auto max-w-[95%] bg-black/20 border border-border/20 backdrop-blur-xl transition-all duration-300"
    >
      {/* Logo Section */}
      <div ref={logoRef}  className="flex items-center px-2 md:px-3">
        <Link href="/" className="flex items-center">
        <div className="bg-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <img src={user?.image || "/dall.png"} alt={user?.name || "Triphla Logo"} width={40} height={40} className="rounded-full"/>
        </div>
        <div className="ml-2 font-semibold text-base md:text-lg hover:text-primary transition-colors duration-300">
          {user?.name?  user.name : "Triphla"}
        </div>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div
        ref={linksRef}
        className="hidden md:flex items-center space-x-4 lg:space-x-8"
      >
        {navLinks.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
            className="text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white hover:text-primary transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Desktop User Actions */}
      <div ref={actionsRef} className="hidden md:flex items-center space-x-2 md:space-x-4">
        <AudioPlayer />
        {/* <SignedOut> */}
        
        {user?
        <div className="rounded-full bg-primary/90 hover:bg-primary px-3 py-1 text-sm text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
            <button mode="modal" 
              onClick={() => signOut()}
            >Log Out</button>
          </div>
        :
        <LoginModal>
          <div className="rounded-full bg-primary/90 hover:bg-primary px-3 py-1 text-sm text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
            <button mode="modal">Sign In</button>
          </div>
        </LoginModal>
        }
        <ThemeToggleButton />
      </div>

      {/* Persistent Mobile AudioPlayer (hidden on desktop) */}
      <div className="hidden">
        <AudioPlayer />
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/30 rounded-xl shadow-lg p-4 md:hidden z-50">
          <div className="flex flex-col divide-y divide-gray-200/20 dark:divide-gray-700/30">
            {navLinks.map((item, index) => (
              <div key={item} className={`py-3 ${index === 0 ? '' : ''}`}>
                <Link
                  href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {/* Icons for each link */}
                  <span className="w-5 h-5">
                    {item === "Home" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    )}
                    {item === "Interface" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                    )}
                    {item === "Dashboard" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    )}
                    {item === "Learn" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    )}
                    {item === "About" && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    )}
                  </span>
                  <span>{item}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Actions Section with Gradient Divider */}
          <div className="relative mt-4 pt-4">
            {/* Gradient Divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent"></div>
            
            <div className="flex items-center justify-between space-x-4 px-2">
              <AudioPlayer />
              {user?
                      <div className="rounded-full bg-primary/90 hover:bg-primary px-3 py-1 text-sm text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
                          <button mode="modal" 
                            onClick={() => signOut()}
                          >Log Out</button>
                        </div>
                      :
                      <LoginModal>
                        <div className="rounded-full bg-primary/90 hover:bg-primary px-3 py-1 text-sm text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
                          <button mode="modal">Sign In</button>
                        </div>
                      </LoginModal>
              }
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
