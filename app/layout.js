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

          <div className="flex">
            
            {children}
            
          </div>

        </body>
      </html>

    </ClerkProvider>
  );
}
