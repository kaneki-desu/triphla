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
                    <div className="bg-base-300 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-base-content">What is the Stock Market?</h3>
                        <p className="text-base-content/90">
                            The stock market is a collection of markets where stocks (pieces of ownership in businesses) are traded between investors.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-base-300">
                            <h4 className="font-semibold mb-2 text-base-content">Key Benefits</h4>
                            <ul className="list-disc list-inside space-y-2 text-base-content/90">
                                <li>Potential for high returns</li>
                                <li>Portfolio diversification</li>
                                <li>Ownership in companies</li>
                                <li>Dividend income</li>
                            </ul>
                        </Card>
                        <Card className="p-4 bg-base-300">
                            <h4 className="font-semibold mb-2 text-base-content">Risks to Consider</h4>
                            <ul className="list-disc list-inside space-y-2 text-base-content/90">
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
                    <div className="bg-base-300 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-base-content">Test Your Knowledge</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-2 text-base-content">1. What is a stock?</p>
                                <div className="space-y-2">
                                    {[
                                        "A piece of ownership in a company",
                                        "A type of currency",
                                        "A government bond",
                                        "A savings account"
                                    ].map((option, index) => (
                                        <Button
                                            key={index}
                                            variant={quizAnswers[0] === index ? "default" : "outline"}
                                            className={`w-full justify-start text-base-content ${quizAnswers[0] === index ? 'bg-primary hover:bg-primary/90' : 'hover:bg-base-300'}`}
                                            onClick={() => setQuizAnswers({ ...quizAnswers, 0: index })}
                                        >
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium mb-2 text-base-content">2. What is market capitalization?</p>
                                <div className="space-y-2">
                                    {[
                                        "The total value of a company's shares",
                                        "The number of employees in a company",
                                        "The company's annual revenue",
                                        "The company's profit margin"
                                    ].map((option, index) => (
                                        <Button
                                            key={index}
                                            variant={quizAnswers[1] === index ? "default" : "outline"}
                                            className={`w-full justify-start text-base-content ${quizAnswers[1] === index ? 'bg-primary hover:bg-primary/90' : 'hover:bg-base-300'}`}
                                            onClick={() => setQuizAnswers({ ...quizAnswers, 1: index })}
                                        >
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="mt-4 bg-primary hover:bg-primary/90 text-primary-content"
                            onClick={() => setShowFeedback(true)}
                        >
                            Check Answers
                        </Button>
                    </div>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-base-300 p-4 rounded-lg"
                        >
                            <h4 className="font-semibold mb-2 text-base-content">Feedback</h4>
                            <p className="text-base-content/90">
                                {quizAnswers[0] === 0 && quizAnswers[1] === 0
                                    ? "Perfect! You've got a great understanding of basic stock market concepts!"
                                    : "Good effort! Review the material and try again to improve your understanding."}
                            </p>
                        </motion.div>
                    )}
                </div>
            )
        },
        {
            title: "Fun Facts",
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-base-300">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="w-6 h-6 text-primary" />
                                <div>
                                    <h4 className="font-semibold mb-2 text-base-content">Did You Know?</h4>
                                    <p className="text-base-content/90">
                                        The first stock exchange was established in Amsterdam in 1602 by the Dutch East India Company.
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 bg-base-300">
                            <div className="flex items-start gap-2">
                                <Info className="w-6 h-6 text-primary" />
                                <div>
                                    <h4 className="font-semibold mb-2 text-base-content">Interesting Fact</h4>
                                    <p className="text-base-content/90">
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
                    <div className="bg-base-300 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-base-content">Match the Terms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold mb-2 text-base-content">Terms</h4>
                                {dragItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-base-200 rounded-lg shadow cursor-move text-base-content"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', item.id);
                                        }}
                                    >
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold mb-2 text-base-content">Definitions</h4>
                                {dragItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-base-200 rounded-lg shadow min-h-[60px] text-base-content/70"
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
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 rounded-3xl -z-10" />
                <div className="absolute top-0 left-0 w-72 h-72 bg-base-300 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-base-300 rounded-full blur-3xl -z-10" />

                <Card className="p-4 md:p-8 space-y-6 md:space-y-8 bg-base-100 backdrop-blur-xl shadow-2xl border border-base-200/50 rounded-3xl">
                    {/* Header Section */}
                    <div className="relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-base-300 text-base-content px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                Interactive Learning
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-center mb-8 text-base-content">
                            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-base-content" />
                            <span>Financial Learning Module</span>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                            disabled={currentSection === 0}
                            className="btn btn-outline btn-sm md:btn-md hover:bg-base-300/50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {sections.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                        index === currentSection
                                            ? 'bg-base-content shadow-lg shadow-base-content/50 scale-125'
                                            : 'bg-base-300 hover:bg-base-content/20'
                                    }`}
                                />
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                            disabled={currentSection === sections.length - 1}
                            className="btn btn-outline btn-sm md:btn-md hover:bg-base-300/50 transition-colors"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
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
                            className="space-y-4 md:space-y-6"
                        >
                            <div className="relative">
                                <h2 className="text-xl md:text-2xl font-semibold text-base-content inline-block">
                                    {sections[currentSection].title}
                                </h2>
                                <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-base-content rounded-full" />
                            </div>
                            <div className="[&_.bg-base-300]:bg-base-100 [&_.bg-primary]:bg-base-100 [&_.bg-base-content]:bg-base-100 [&_.bg-base-content/90]:bg-base-100">
                                {sections[currentSection].content}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 md:mt-8 pt-4 border-t border-base-300/30">
                        <div className="flex items-center gap-2 text-base-content/70">
                            <Brain className="w-5 h-5 text-base-content" />
                            <span>Section {currentSection + 1} of {sections.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-base-content" />
                            <span className="text-base-content/70">
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