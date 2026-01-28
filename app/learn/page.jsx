'use client';
import LearningModule from '@/components/LearningModule.jsx';
import QuizComponent from '@/components/QuizComponent';
import { BookOpenCheck, HelpCircle } from 'lucide-react';

export default function LearnPage() {

  // if (!user) {
  //   return (
  //     <div data-theme="coffee" className="min-h-screen w-full bg-base-200">
  //       <div className="flex items-center justify-center min-h-[80vh] px-4">
  //         <div className="text-center p-6 sm:p-8 bg-base-100 rounded-lg shadow-xl w-full max-w-md">
  //           <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-content-primary">
  //             Please sign in to access the learning center
  //           </h1>
  //           <button
  //             className="btn btn-primary w-full sm:w-auto"
  //             onClick={() => window.location.href = '/sign-in'}
  //           >
  //             Sign In
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      data-theme="coffee"
      className="min-h-screen w-full flex flex-col bg-gradient-to-br from-base-100 via-amber-900 to-base-300 text-amber-100"
    >
      <div className="w-full max-w-7xl mx-auto flex-grow px-4 sm:px-6 lg:px-8">
        <main className="py-10 sm:py-12 md:py-16">
          {/* Header */}
          <header className="mb-12 sm:mb-16 text-center px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-amber-200 tracking-tight leading-tight">
              Unlock Your Financial Potential: An Interactive Journey
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed">
              Welcome to your personal finance learning hub! Dive into engaging modules and sharpen your skills with interactive quizzes designed to make learning finance fun and effective.
            </p>
          </header>

          {/* Section 1: Modules */}
          <section className="mb-12 sm:mb-16 p-6 sm:p-8 bg-amber-950/50 rounded-2xl shadow-lg border border-amber-800/40">
            <div className="flex items-start sm:items-center gap-4 mb-6 flex-col sm:flex-row">
              <BookOpenCheck className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
                Dive into Interactive Learning Modules
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-amber-100/90 leading-relaxed mb-6">
              Our learning modules are your gateway to understanding the world of finance. We break down complex topics like the
              <span className="font-semibold text-amber-200"> Stock Market</span>,
              <span className="font-semibold text-amber-200"> Trading Strategies</span>, and
              <span className="font-semibold text-amber-200"> Derivatives</span> into digestible, interactive lessons. Each module features:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-base sm:text-lg md:text-xl text-amber-100/90 mb-8">
              <li>Clear introductions to core concepts.</li>
              <li>Engaging activities like term matching.</li>
              <li>Fun facts to keep things interesting.</li>
              <li>Quizzes to check your understanding along the way.</li>
            </ul>
            <p className="text-base sm:text-lg md:text-xl text-amber-100/90 mb-6">
              Explore the module below to start building a solid financial foundation. Navigate through sections using the 'Previous' and 'Next' buttons, and track your progress!
            </p>
            <LearningModule />
          </section>

          {/* Section 2: Quiz */}
          <section className="mb-12 sm:mb-16 p-6 sm:p-8 bg-amber-950/50 rounded-2xl shadow-lg border border-amber-800/40">
            <div className="flex items-start sm:items-center gap-4 mb-6 flex-col sm:flex-row">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
                Test Your Financial Acumen
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-amber-100/90 mb-6">
              Ready to challenge yourself? Our comprehensive quizzes help reinforce the concepts you've learned in the modules. Get immediate feedback on your answers and identify areas where you shine or might need a little more practice.
            </p>
            <QuizComponent />
          </section>

          {/* Section 3: Tool Explanation */}
          <section className="mb-12 sm:mb-16 p-6 sm:p-8 bg-amber-950/50 rounded-2xl shadow-lg border border-amber-800/40">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-amber-300">
              Behind the Scenes: Our Learning Tools
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-amber-100/90 mb-4">
              The <span className="font-semibold text-amber-200">LearningModule</span> component is the heart of our interactive lessons. It dynamically presents various section types, including introductions, quizzes, fun facts, and term matching, guiding you step-by-step through each topic.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-amber-100/90">
              The <span className="font-semibold text-amber-200">QuizComponent</span> provides a dedicated space to test your overall understanding after completing modules. It features multiple-choice questions and instant feedback to solidify your learning.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
