
import "./globals.css";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";

export const metadata = {
  title: "Triphla",
  description: "GenAI-powered Financial Literacy & Investment Learning Platform",
  icons: {
    icon: "/dallTab.png",
  },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className="scroll-smooth" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
        <body> {/* Remove data-theme and grid classes if not needed globally */}
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
          <div id='modal-root' />
        </body>
      </html>
  );
}
