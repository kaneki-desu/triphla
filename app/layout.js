import { React, Suspense } from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
          <div className="flex mb-3 h-[80vh] w-[100vw]">
            <div data-theme="dark" className="w-3 h-full"></div>
            {children}
            <div data-theme="dark" className="w-3 h-full"></div>
          </div>

        </body>
      </html>

    </ClerkProvider>
  );
}
