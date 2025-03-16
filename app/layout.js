import React from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Card from "@/components/cards";
import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* <link rel="icon" href="/dall.png" /> */}
          <title>Triphla</title>
        </head>

        <body className="grid w-full h-full">
          <header>

          </header>
          <div className="w-full h-3"></div>
          <div className="flex h-[80vh] w-[100vw]">
            <div data-theme="dark" className="w-3 h-full"></div>
            {children}
            <div data-theme="dark" className="w-3 h-full"></div>
          </div>
          <div className="flex">
            <div data-theme="coffee" className="my-3 mx-3 rounded-xl w-[56.2vw] h-[40vh]">
              {/* <Image src="/kar.jpg" alt="kar" width="56.25vw" height="20vh"/> */}
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
