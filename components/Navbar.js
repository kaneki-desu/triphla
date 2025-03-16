import next from "next";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center">
            <div className="flex space-x-2">
                <div className="my-7 ml-7 bg-white w-10 rounded-full flex items-center justify-center overflow-hidden">
                    <Image src="/dall.png" alt="Triphla Logo" width={128} height={128} />
                </div>
                <div className="my-9">triphla</div>
            </div>
            <div className="flex fix justify-center items-center space-x-14 px-16">
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

            </div>
            <div className="flex space-x-4 ml-12 mr-4">
                <SignedOut>
                    <div className="rounded-full btn btn-active">
                        <SignInButton mode="modal" />
                    </div>
                </SignedOut>

                <SignedIn>
                    <div className="pr-5">
                        <UserButton />
                    </div>
                </SignedIn>

            </div>
        </nav>
    );
}
