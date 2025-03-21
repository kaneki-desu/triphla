import React from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Card from "@/components/cards";
import Typing from "@/components/typing";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          {/* <link rel="icon" href="/dall.png" /> */}
          <title>Triphla</title>
        </head>

        <body data-theme="dark" className="grid w-full h-full">
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
              <div className="absolute pl-16 mr-1 right-0 w-[27.5vw] h-full">
                <span data-theme="coffee" className="mt-12 opacity-90 flex items-center justify-center w-10 h-10 rounded-full">
                  <i className="ri-chat-ai-fill"></i>
                </span>
                <div className="pb-10">
                  <Typing></Typing>
                  <div data-theme="coffee" className="opacity-90 absolute text-xs flex items-center justify-between rounded-full mb-5 px-5 bottom-0 w-[18.5vw] h-[5vh]">
                    LEARN MORE
                    <Link href="/about">
                      <i className="ri-add-fill"></i>
                    </Link>

                  </div>
                </div>
              </div>
            </div>
            <Card id="1" />
            <Card id="2" />
          </div>
          {/* <footer className="bottom-0 text-center text-white">
            <p>&copy; 2021 Triphla</p>
          </footer> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
