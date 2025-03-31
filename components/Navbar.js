import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {ThemeToggleButton} from "./ui/theme-toggle-button"; // Corrected import name

export default function Navbar() {
    return (
        // Added background, padding, border, and ensured items are centered vertically
        <nav className="flex justify-between items-center px-6 py-3 bg-background  border-b border-border sticky top-0 z-50">
            {/* Adjusted logo section spacing and alignment */}
            <div className="flex items-center px-3">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"> {/* Made height explicit */}
                    <Image src="/dall.png" alt="Triphla Logo" width={32} height={32} /> {/* Adjusted size */}
                </div>
                <div className="font-semibold text-lg text-foreground">triphla</div> {/* Added font weight/size */}
            </div>
            {/* Adjusted link styling and added Dashboard link */}
            <div className="flex items-center space-x-8"> {/* Adjusted spacing */}
                <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                    Home
                </Link>
                <Link href="/interface" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                    Interface
                </Link>
                 <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"> {/* Added Dashboard link */}
                    Dashboard
                </Link>
                 <Link href="/learn" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"> {/* Added learn link */}
                    Learn
                </Link>
                <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                    About
                </Link>
            </div>
            {/* Ensured right-side items are centered vertically */}
            <div className="flex items-center space-x-4">
                <SignedOut>
                    {/* Consider using a standard button component if available */}
                    <div className="rounded-full btn btn-sm btn-primary"> {/* Adjusted button size/style */}
                        <SignInButton mode="modal">Sign In</SignInButton> {/* Added text */}
                    </div>
                </SignedOut>

                <SignedIn>
                    {/* UserButton usually handles its own styling */}
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <ThemeToggleButton />
            </div>
        </nav>
    );
}
