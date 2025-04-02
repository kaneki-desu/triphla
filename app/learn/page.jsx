'use client';
import LearningModule from '@/components/LearningModule';
import QuizComponent from '@/components/QuizComponent';
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";

export default function LearnPage() {
    const { user } = useUser();

    if (!user) {
        return (
            <div data-theme="coffee" className="min-h-screen w-full">
                {/* <Navbar /> */}
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <h1 className="text-2xl mb-4">Please sign in to access the learning module</h1>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/sign-in'}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="coffee" className="min-h-screen w-full flex flex-col">
            {/* <Navbar /> */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="w-full max-w-[1200px] mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
                        <QuizComponent />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Learning Modules</h2>
                        <LearningModule />
                    </div>
                </div>
            </main>
        </div>
    );
}