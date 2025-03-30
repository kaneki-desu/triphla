'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    BookOpen, 
    Brain, 
    Lightbulb, 
    Trophy, 
    ArrowRight, 
    ArrowLeft,
    CheckCircle,
    XCircle,
    Info
} from 'lucide-react';

const LearningModule = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [dragItems, setDragItems] = useState([
        { id: 1, text: "Stock Market", definition: "A marketplace where shares of publicly traded companies are issued, bought, and sold" },
        { id: 2, text: "Dividend", definition: "A payment made by a corporation to its shareholders, usually as a distribution of profits" },
        { id: 3, text: "Bull Market", definition: "A market condition where prices are rising or expected to rise" },
        { id: 4, text: "Bear Market", definition: "A market condition where prices are falling or expected to fall" }
    ]);

    const sections = [
        {
            title: "Introduction to Stock Market",
            content: (
                <div className="space-y-6">
                    <div className="bg-amber-950/60 p-6 rounded-lg border border-amber-800/40 shadow-lg">
                        <h3 className="text-2xl font-bold mb-3 text-amber-200">What is the Stock Market?</h3>
                        <p className="text-xl text-amber-100/90 leading-relaxed">
                            The stock market is a collection of markets where stocks (pieces of ownership in businesses) are traded between investors.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                            <h4 className="text-xl font-bold mb-3 text-amber-200">Key Benefits</h4>
                            <ul className="list-disc list-inside space-y-3 text-lg text-amber-100/90">
                                <li>Potential for high returns</li>
                                <li>Portfolio diversification</li>
                                <li>Ownership in companies</li>
                                <li>Dividend income</li>
                            </ul>
                        </Card>
                        <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                            <h4 className="text-xl font-bold mb-3 text-amber-200">Risks to Consider</h4>
                            <ul className="list-disc list-inside space-y-3 text-lg text-amber-100/90">
                                <li>Market volatility</li>
                                <li>Potential losses</li>
                                <li>Economic factors</li>
                                <li>Company performance</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            title: "Interactive Quiz",
            content: (
                <div className="space-y-6">
                    <div className="bg-amber-950/60 p-8 rounded-lg border border-amber-800/40 shadow-lg">
                        <h3 className="text-3xl  text-center mt-16  p-6  font-bold mb-5 text-amber-200">Test Your Knowledge</h3>
                        <div className="space-y-6">
                            
                            <div>
                                <p className="font-semibold mb-3 text-xl text-amber-100">1. What is a stock?</p>
                                <div className="space-y-3">
                                    {[
                                        "A piece of ownership in a company",
                                        "A type of currency",
                                        "A government bond",
                                        "A savings account"
                                    ].map((option, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                w-full text-left p-4 rounded-lg text-lg transition-all duration-300
                                                ${quizAnswers[0] === index 
                                                    ? 'bg-amber-600 text-amber-50 shadow-md transform scale-105' 
                                                    : 'bg-amber-900/70 text-amber-100 border border-amber-700 hover:bg-amber-800 hover:shadow-lg cursor-pointer'}
                                            `}
                                            onClick={() => {
                                                setQuizAnswers({ ...quizAnswers, 0: index });
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                                    ${quizAnswers[0] === index 
                                                        ? 'bg-amber-50 text-amber-600' 
                                                        : 'border border-amber-500 text-transparent'}`
                                                }>
                                                    {quizAnswers[0] === index && <CheckCircle className="w-5 h-5" />}
                                                </div>
                                                {option}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold mb-3 text-xl text-amber-100">2. What is market capitalization?</p>
                                <div className="space-y-3">
                                    {[
                                        "The total value of a company's shares",
                                        "The number of employees in a company",
                                        "The company's annual revenue",
                                        "The company's profit margin"
                                    ].map((option, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                w-full text-left p-4 rounded-lg text-lg transition-all duration-300
                                                ${quizAnswers[1] === index 
                                                    ? 'bg-amber-600 text-amber-50 shadow-md transform scale-105' 
                                                    : 'bg-amber-900/70 text-amber-100 border border-amber-700 hover:bg-amber-800 hover:shadow-lg cursor-pointer'}
                                            `}
                                            onClick={() => {
                                                setQuizAnswers({ ...quizAnswers, 1: index });
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                                    ${quizAnswers[1] === index 
                                                        ? 'bg-amber-50 text-amber-600' 
                                                        : 'border border-amber-500 text-transparent'}`
                                                }>
                                                    {quizAnswers[1] === index && <CheckCircle className="w-5 h-5" />}
                                                </div>
                                                {option}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6 bg-amber-600 hover:bg-amber-700 text-amber-50 text-lg px-6 py-3 rounded-lg shadow-lg border border-amber-500 transition-all duration-300 font-medium"
                            onClick={() => setShowFeedback(true)}
                        >
                            Check Answers
                        </motion.button>
                    </div>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-950/60 p-6 rounded-lg border border-amber-800/40 shadow-lg"
                        >
                            <h4 className="text-xl font-bold mb-3 text-amber-200 flex items-center gap-2">
                                {quizAnswers[0] === 0 && quizAnswers[1] === 0 
                                    ? <><CheckCircle className="w-6 h-6 text-green-400" /> Correct!</>
                                    : <><XCircle className="w-6 h-6 text-red-400" /> Almost there!</>
                                }
                            </h4>
                            <p className="text-lg text-amber-100/90">
                                {quizAnswers[0] === 0 && quizAnswers[1] === 0
                                    ? "Perfect! You've got a great understanding of basic stock market concepts!"
                                    : "Good effort! Review the material and try again to improve your understanding."}
                            </p>
                            <div className="mt-4 space-y-2">
                                <p className="text-md text-amber-200">Correct answers:</p>
                                <p className="text-md text-amber-100">1. A piece of ownership in a company</p>
                                <p className="text-md text-amber-100">2. The total value of a company's shares</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )
        },
        {
            title: "Fun Facts",
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                            <div className="flex items-start gap-4">
                                <Lightbulb className="w-8 h-8 text-amber-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xl font-bold mb-3 text-amber-200">Did You Know?</h4>
                                    <p className="text-lg text-amber-100/90 leading-relaxed">
                                        The first stock exchange was established in Amsterdam in 1602 by the Dutch East India Company.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                            <div className="flex items-start gap-4">
                                <Info className="w-8 h-8 text-amber-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xl font-bold mb-3 text-amber-200">Interesting Fact</h4>
                                    <p className="text-lg text-amber-100/90 leading-relaxed">
                                        The term "bull market" comes from the way a bull attacks its prey - thrusting its horns upward.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )
        },
        {
            title: "Term Matching",
            content: (
                <div className="space-y-6">
                    <div className="bg-amber-950/60 p-8 rounded-lg border border-amber-800/40 shadow-lg">
                        <h3 className="text-2xl font-bold mb-5 text-amber-200">Match the Terms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-xl font-bold mb-3 text-amber-200">Terms</h4>
                                {dragItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-amber-900/60 rounded-lg shadow-md cursor-move text-lg text-amber-100 border border-amber-800/40 hover:border-amber-700 transition-colors hover:bg-amber-800/70 active:bg-amber-700/80"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', item.id);
                                        }}
                                    >
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xl font-bold mb-3 text-amber-200">Definitions</h4>
                                {dragItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-amber-900/60 rounded-lg shadow-md min-h-[70px] text-lg text-amber-100/50 border border-amber-800/40 border-dashed hover:border-amber-600 hover:bg-amber-800/30 transition-all"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const id = parseInt(e.dataTransfer.getData('text/plain'));
                                            // Handle matching logic here
                                        }}
                                    >
                                        Drop term here
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="relative">
                {/* Decorative background elements with chocolate/brown theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 rounded-3xl -z-10" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-800/40 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-800/40 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-1/2 left-1/4 w-32 h-32 bg-amber-600/20 rounded-full blur-2xl -z-10" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-600/20 rounded-full blur-2xl -z-10" />

                <Card className="p-6 md:p-10 space-y-8 md:space-y-10 bg-gradient-to-br from-amber-950 to-amber-900 backdrop-blur-xl shadow-2xl border border-amber-800/50 rounded-3xl">
                    {/* Header Section - Repositioned Interactive Learning above Financial Learning Module */}
                    <div className="relative flex flex-col items-center">
                        <div className="bg-amber-600 text-amber-50 px-8 py-3 rounded-full text-lg font-bold shadow-lg mb-4">
                            Interactive Learning
                        </div>
                        <div className="flex items-center justify-center gap-4 text-3xl md:text-4xl font-extrabold text-center text-amber-100">
                            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
                            <span>Financial Learning Module</span>
                        </div>
                    </div>

                    {/* Navigation Section - Improved button visibility */}
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <Button
                            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                            disabled={currentSection === 0}
                            className={`
                                bg-gradient-to-r from-amber-500 to-amber-600 
                                hover:from-amber-600 hover:to-amber-700
                                text-amber-50 py-3 px-6 text-lg font-medium rounded-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                border border-amber-500
                                transition-all duration-300
                                ${currentSection === 0 ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-x-1'}
                            `}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-3">
                            {sections.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                                        index === currentSection
                                            ? 'bg-amber-400 shadow-lg shadow-amber-400/50 scale-125'
                                            : 'bg-amber-800 hover:bg-amber-700 cursor-pointer'
                                    }`}
                                    onClick={() => setCurrentSection(index)}
                                />
                            ))}
                        </div>
                        <Button
                            onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                            disabled={currentSection === sections.length - 1}
                            className={`
                                bg-gradient-to-r from-amber-500 to-amber-600 
                                hover:from-amber-600 hover:to-amber-700
                                text-amber-50 py-3 px-6 text-lg font-medium rounded-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                border border-amber-500
                                transition-all duration-300
                                ${currentSection === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : 'transform hover:translate-x-1'}
                            `}
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content Section */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="relative">
                                <h2 className="text-2xl md:text-3xl font-bold text-amber-200 inline-block">
                                    {sections[currentSection].title}
                                </h2>
                                <div className="absolute -bottom-3 left-0 w-1/3 h-1 bg-amber-600 rounded-full" />
                            </div>
                            <div>
                                {sections[currentSection].content}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 md:mt-10 pt-6 border-t border-amber-800/30">
                        <div className="flex items-center gap-3 text-amber-400">
                            <Brain className="w-6 h-6 text-amber-400" />
                            <span className="text-lg">Section {currentSection + 1} of {sections.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-amber-400" />
                            <span className="text-lg text-amber-400">
                                Progress: {Math.round(((currentSection + 1) / sections.length) * 100)}%
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default LearningModule;