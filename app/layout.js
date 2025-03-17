import React from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Card from "@/components/cards";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* <link rel="icon" href="/dall.png" /> */}
          <title>Triphla</title>
        </head>

        <body className="grid w-full h-full">
          <header></header>
          <div className="w-full h-3"></div>
          <div className="flex h-[80vh] w-[100vw]">
            <div data-theme="dark" className="w-3 h-full"></div>
            {children}
            <div data-theme="dark" className="w-3 h-full"></div>
          </div>
          <div className="flex">
            <div className="relative my-3 mx-3 rounded-xl w-[45vw] h-[25.6vw] overflow-hidden">
              <Image
                src="/bitc.jpeg"
                alt="Dall"
                layout="fill"
                objectFit="cover"
                className="opacity-60"
              />
              <div className="absolute mr-1 right-0 w-[20vw] h-full">
              <span data-theme="coffee"  className="mt-12 ml-4 opacity-90 flex items-center justify-center w-10 h-10 rounded-full">
                    <i className="ri-chat-ai-fill"></i>
                  </span>
                <div className="grid place-items-center">
                  
                  <div data-theme="coffee" className="mt-5 opacity-90 rounded-2xl grid place-items-center w-[17vw] h-[11vh]">
                    <h1 className="mb-1 text-xl">AI-powered platform<br /> for investing in crypto</h1>
                  </div>
                  <div data-theme="coffee" className="opacity-90 absolute text-xs flex items-center justify-between rounded-full mb-5 px-5 bottom-0 w-[17vw] h-[5vh]">
                    LEARN MORE
                    <Link href="/about">
                      <i className="ri-add-fill"></i>
                    </Link>
                    
                  </div>
                </div>
              </div>
            </div>
            <Card />
            <Card />
          </div>
          {/* <footer className="bottom-0 text-center text-white">
            <p>&copy; 2021 Triphla</p>
          </footer> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
