'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { learningModulesData } from '@/lib/data/learningModuleData'; // Import new data structure
import { 
    BookOpen, 
    Brain, 
    Lightbulb, 
    Trophy, 
    ArrowRight, 
    ArrowLeft,
    CheckCircle,
    XCircle,
    Info,
    HelpCircle // Added for default case
} from 'lucide-react';
import Xarrow, { Xwrapper } from 'react-xarrows'; // Import react-xarrows

// --- Sub-components for different section types ---

const IntroductionSection = ({ section }) => (
    <div className="space-y-6">
        <div className="bg-amber-950/60 p-6 rounded-lg border border-amber-800/40 shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-amber-200">{section.title}</h3>
            <p className="text-xl text-amber-100/90 leading-relaxed">
                {section.mainText}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                <h4 className="text-xl font-bold mb-3 text-amber-200">Key Benefits</h4>
                <ul className="list-disc list-inside space-y-3 text-lg text-amber-100/90">
                    {section.keyBenefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
                </ul>
            </Card>
            <Card className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                <h4 className="text-xl font-bold mb-3 text-amber-200">Risks to Consider</h4>
                <ul className="list-disc list-inside space-y-3 text-lg text-amber-100/90">
                    {section.risks.map((risk, index) => <li key={index}>{risk}</li>)}
                </ul>
            </Card>
        </div>
    </div>
);

const QuizSection = ({ section, quizAnswers, setQuizAnswers, showFeedback, setShowFeedback }) => {
    const checkAnswers = () => {
        setShowFeedback(true);
        // Basic check: assumes all answers must be correct
        return section.questions.every((q, index) => quizAnswers[index] === q.correctAnswerIndex);
    };
    const allCorrect = section.questions.every((q, index) => quizAnswers[index] === q.correctAnswerIndex);

    return (
        <div className="space-y-6">
            <div className="bg-amber-950/60 p-8 rounded-lg border border-amber-800/40 shadow-lg">
                <h3 className="text-3xl text-center mt-16 p-6 font-bold mb-5 text-amber-200">{section.title}</h3>
                <div className="space-y-6">
                    {section.questions.map((q, qIndex) => (
                        <div key={qIndex}>
                            <p className="font-semibold mb-3 text-xl text-amber-100">{q.questionText}</p>
                            <div className="space-y-3">
                                {q.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            w-full text-left p-4 rounded-lg text-lg transition-all duration-300
                                            ${quizAnswers[qIndex] === index
                                                ? 'bg-amber-600 text-amber-50 shadow-md transform scale-105'
                                                : 'bg-amber-900/70 text-amber-100 border border-amber-700 hover:bg-amber-800 hover:shadow-lg cursor-pointer'}
                                        `}
                                        onClick={() => {
                                            setQuizAnswers(prev => ({ ...prev, [qIndex]: index }));
                                            setShowFeedback(false); // Hide feedback when changing answer
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                                ${quizAnswers[qIndex] === index
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'border border-amber-500 text-transparent'}`
                                            }>
                                                {quizAnswers[qIndex] === index && <CheckCircle className="w-5 h-5" />}
                                            </div>
                                            {option}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 bg-amber-600 hover:bg-amber-700 text-amber-50 text-lg px-6 py-3 rounded-lg shadow-lg border border-amber-500 transition-all duration-300 font-medium"
                    onClick={checkAnswers}
                    disabled={Object.keys(quizAnswers).length !== section.questions.length} // Disable until all questions answered
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
                        {allCorrect
                            ? <><CheckCircle className="w-6 h-6 text-green-400" /> Correct!</>
                            : <><XCircle className="w-6 h-6 text-red-400" /> Almost there!</>
                        }
                    </h4>
                    <p className="text-lg text-amber-100/90">
                        {allCorrect
                            ? "Perfect! You've got a great understanding!"
                            : "Good effort! Review the material and try again to improve your understanding."}
                    </p>
                    {!allCorrect && (
                         <div className="mt-4 space-y-2">
                             <p className="text-md text-amber-200">Correct answers:</p>
                             {section.questions.map((q, index) => (
                                 <p key={index} className="text-md text-amber-100">{q.questionText} - {q.options[q.correctAnswerIndex]}</p>
                             ))}
                         </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

const FunFactsSection = ({ section }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.facts.map((fact, index) => (
                <Card key={index} className="p-6 bg-amber-950/60 border border-amber-800/40 shadow-lg">
                    <div className="flex items-start gap-4">
                        {fact.title === "Did You Know?" ? <Lightbulb className="w-8 h-8 text-amber-400 flex-shrink-0" /> : <Info className="w-8 h-8 text-amber-400 flex-shrink-0" />}
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-amber-200">{fact.title}</h4>
                            <p className="text-lg text-amber-100/90 leading-relaxed">
                                {fact.text}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};


const TermMatchingSection = ({ section }) => {
    // State to store the matched pairs { termId: string, definitionId: string }
    const [matches, setMatches] = useState([]);
    // State to hold the shuffled definitions
    const [shuffledDefinitions, setShuffledDefinitions] = useState([]);

    // Shuffle definitions only once when the component mounts or section changes
    useEffect(() => {
        setShuffledDefinitions(shuffleArray([...section.definitions]));
        setMatches([]); // Reset matches when section changes
    }, [section]);

    const handleDragStart = (e, termId) => {
        e.dataTransfer.setData('text/plain', termId);
    };

    const handleDrop = (e, definitionId) => {
        e.preventDefault();
        const termId = parseInt(e.dataTransfer.getData('text/plain'));

        // Check if the drop target (definition) is already matched
        const isDefinitionMatched = matches.some(match => match.definitionId === `def-${definitionId}`);
        // Check if the dragged term is already matched
        const isTermMatched = matches.some(match => match.termId === `term-${termId}`);

        // Allow drop only if both term and definition are not already matched
        if (!isDefinitionMatched && !isTermMatched) {
            // Check if the IDs match (termId === definitionId implies a correct match)
            if (termId === definitionId) {
                setMatches(prev => [
                    ...prev,
                    { termId: `term-${termId}`, definitionId: `def-${definitionId}` }
                ]);
            } else {
                // Optional: Add feedback for incorrect match (e.g., shake animation, temporary red border)
                console.log("Incorrect match attempt");
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    // Check if a specific term or definition is part of a match
    const isTermMatched = (termId) => matches.some(match => match.termId === `term-${termId}`);
    const isDefinitionMatched = (defId) => matches.some(match => match.definitionId === `def-${defId}`);

    // Define colors for the lines
    const lineColors = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa"]; // amber-400, emerald-400, blue-400, pink-400, violet-400

    return (
        <div className="space-y-6">
            <div className="bg-amber-950/60 p-8 rounded-lg border border-amber-800/40 shadow-lg">
                <h3 className="text-2xl font-bold mb-5 text-amber-200">{section.title}</h3>
                {/* Wrap content in Xwrapper for react-xarrows */}
                <Xwrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative"> {/* Added relative positioning */}
                        {/* Terms Column */}
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold mb-3 text-amber-200">Terms</h4>
                            {section.terms.map((item) => {
                                const termHtmlId = `term-${item.id}`;
                                const matched = isTermMatched(termHtmlId);
                                return (
                                    <div
                                        id={termHtmlId} // Assign ID for Xarrow
                                        key={termHtmlId}
                                        className={`p-4 bg-amber-900/60 rounded-lg shadow-md text-lg text-amber-100 border border-amber-800/40 transition-all duration-300 
                                            ${matched ? 'opacity-50 cursor-default' : 'cursor-move hover:border-amber-700 hover:bg-amber-800/70 active:bg-amber-700/80'}`}
                                        draggable={!matched} // Draggable only if not matched
                                        onDragStart={(e) => !matched && handleDragStart(e, item.id)}
                                    >
                                        {item.text}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Definitions Column (Shuffled) */}
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold mb-3 text-amber-200">Definitions</h4>
                            {shuffledDefinitions.map((item) => {
                                const defHtmlId = `def-${item.id}`;
                                const matched = isDefinitionMatched(defHtmlId);
                                return (
                                    <div
                                        id={defHtmlId} // Assign ID for Xarrow
                                        key={defHtmlId}
                                        className={`p-4 bg-amber-900/60 rounded-lg shadow-md min-h-[70px] text-lg text-amber-100 border border-amber-800/40 transition-all duration-300 
                                            ${matched ? 'border-green-500 border-solid' : 'hover:border-amber-600 hover:bg-amber-800/30'}`} // Highlight if matched, allow hover if not
                                        onDragOver={!matched ? handleDragOver : undefined} // Allow drop only if not matched
                                        onDrop={(e) => !matched && handleDrop(e, item.id)}
                                    >
                                        {item.definition}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Render arrows for matched pairs */}
                        {matches.map((match, index) => (
                            <Xarrow
                                key={index}
                                start={match.termId} // ID of the start element
                                end={match.definitionId} // ID of the end element
                                color={lineColors[index % lineColors.length]} // Cycle through colors
                                strokeWidth={2}
                                path="smooth" // Or "grid", "straight"
                                dashness={false}
                                headSize={4}
                                // Optional: Adjust anchors for better line placement
                                // startAnchor="right" 
                                // endAnchor="left"
                            />
                        ))}
                    </div>
                </Xwrapper>
                 {/* Optional: Add a button here to check completion or reset */}
                 {matches.length === section.terms.length && (
                     <p className="text-center text-green-400 font-bold mt-6">All terms matched correctly!</p>
                 )}
            </div>
        </div>
    );
};

// --- Congratulation Component ---
const CongratulationSection = () => (
    <div className="space-y-6">
        <div className="bg-amber-950/60 p-8 rounded-lg border border-amber-800/40 shadow-lg text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Trophy className="w-24 h-24 mx-auto text-amber-400 mb-6" />
            </motion.div>
            <h3 className="text-4xl font-bold mb-6 text-amber-200">Congratulations!</h3>
            <p className="text-2xl text-amber-100/90 leading-relaxed mb-8">
                You've successfully completed this section of the financial learning module!
            </p>
            <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 
                    hover:from-amber-600 hover:to-amber-700
                    text-amber-50 py-3 px-6 text-lg font-medium rounded-lg
                    shadow-lg hover:shadow-xl
                    border border-amber-500
                    transition-all duration-300">
                    Continue Learning
                </Button>
            </motion.div>
        </div>
    </div>
);

// --- Main Learning Module Component ---

const LearningModule = ({ initialTopic = 'stockMarket' }) => { // Accept initial topic as prop
    const [currentTopicKey, setCurrentTopicKey] = useState(initialTopic);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [customSections, setCustomSections] = useState(null); // To store modified sections with congratulation
    // Term matching state is now inside TermMatchingSection

    // Reset state when topic changes
    useEffect(() => {
        setCurrentSectionIndex(0);
        setQuizAnswers({});
        setShowFeedback(false);
        setCustomSections(null);
        // Reset term matching state if it were managed here
    }, [currentTopicKey]);

    const currentModule = learningModulesData[currentTopicKey];
    if (!currentModule) {
        return <div>Error: Topic not found!</div>; // Handle invalid topic
    }
    
    // Use custom sections if available, otherwise use the original sections
    const sections = customSections || currentModule.sections;
    const currentSection = sections[currentSectionIndex];

    // Check if the current section is completed
    const isCurrentSectionCompleted = () => {
        if (!currentSection) return false;
        
        switch (currentSection.type) {
            case 'introduction':
                return true; // Introduction is always considered completed
            case 'quiz':
                return showFeedback && currentSection.questions.every((q, index) => quizAnswers[index] === q.correctAnswerIndex);
            case 'funFacts':
                return true; // Fun facts are always considered completed
            case 'termMatching':
                // We don't have direct access to the matches state here, so we'll consider it completed
                // In a real app, you might want to pass a callback from TermMatchingSection to update a state here
                return true;
            case 'congratulation':
                return true; // Congratulation is always considered completed
            default:
                return false;
        }
    };

    // Function to handle next button click
    const handleNextClick = () => {
        if (isCurrentSectionCompleted()) {
            // If this is the last section, add congratulation section
            if (currentSectionIndex === sections.length - 1) {
                // Create a new array with all existing sections plus the congratulation section
                const newSections = [...sections, {
                    type: 'congratulation',
                    title: 'Congratulations!'
                }];
                
                setCustomSections(newSections);
                setCurrentSectionIndex(sections.length); // Move to the new congratulation section
            } else {
                // Otherwise move to next section
                setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1));
            }
        } else {
            // If section not completed, just move to next section as before
            setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1));
        }
    };

    // Function to render the correct section component based on type
    const renderSectionContent = (section) => {
        switch (section.type) {
            case 'introduction':
                return <IntroductionSection section={section} />;
            case 'quiz':
                return <QuizSection 
                            section={section} 
                            quizAnswers={quizAnswers} 
                            setQuizAnswers={setQuizAnswers} 
                            showFeedback={showFeedback} 
                            setShowFeedback={setShowFeedback} 
                        />;
            case 'funFacts':
                return <FunFactsSection section={section} />;
            case 'termMatching':
                // Pass necessary props if term matching state was managed here
                return <TermMatchingSection section={section} />; 
            case 'congratulation':
                return <CongratulationSection />;
            default:
                return <div className="flex items-center gap-2 text-amber-300"><HelpCircle className="w-5 h-5" /> Unknown section type: {section.type}</div>;
        }
    };

    // Add any necessary drop handler logic for Term Matching if needed
    // const handleDrop = (draggedItemId, targetItemId) => { ... }

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
                            onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
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
                                        index === currentSectionIndex // Use correct state variable here
                                            ? 'bg-amber-400 shadow-lg shadow-amber-400/50 scale-125' // These classes create the glow
                                            : 'bg-amber-800 hover:bg-amber-700 cursor-pointer'
                                    }`}
                                    onClick={() => setCurrentSectionIndex(index)} // Use correct state setter here
                                />
                            ))}
                        </div>
                        <Button
                            onClick={handleNextClick}
                            disabled={currentSection === sections.length - 1 && !isCurrentSectionCompleted()}
                            className={`
                                bg-gradient-to-r from-amber-500 to-amber-600 
                                hover:from-amber-600 hover:to-amber-700
                                text-amber-50 py-3 px-6 text-lg font-medium rounded-lg
                                shadow-lg hover:shadow-xl
                                flex items-center gap-2
                                border border-amber-500
                                transition-all duration-300
                                ${currentSection === sections.length - 1 && !isCurrentSectionCompleted() ? 'opacity-50 cursor-not-allowed' : 'transform hover:translate-x-1'}
                            `}
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content Section */}
                    <AnimatePresence mode="wait">
                        {/* Add check to ensure currentSection exists before rendering */}
                        {currentSection && ( 
                            <motion.div
                                key={`${currentTopicKey}-${currentSectionIndex}`} // Use updated key from previous attempt
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="relative">
                                    <h2 className="text-2xl md:text-3xl font-bold text-amber-200 inline-block">
                                        {/* Access title safely */}
                                        {currentSection.title} 
                                    </h2>
                                    <div className="absolute -bottom-3 left-0 w-1/3 h-1 bg-amber-600 rounded-full" />
                                </div>
                                <div>
                                    {/* Render content safely */}
                                    {renderSectionContent(currentSection)}
                                </div>
                            </motion.div>
                        )} 
                    </AnimatePresence>

                    {/* Footer Section */}
                    {/* Add check for sections length before rendering footer */}
                    {sections && sections.length > 0 && currentSection && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 md:mt-10 pt-6 border-t border-amber-800/30">
                        <div className="flex items-center gap-3 text-amber-400">
                            <Brain className="w-6 h-6 text-amber-400" />
                            {/* Use currentSectionIndex safely */}
                            <span className="text-lg">Section {currentSectionIndex + 1} of {sections.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-amber-400" />
                            <span className="text-lg text-amber-400">
                                {/* Calculate progress safely */}
                                Progress: {Math.round(((currentSectionIndex + 1) / sections.length) * 100)}%
                            </span>
                        </div>
                    </div>
                    )} 
                </Card>
            </div>
        </motion.div>
    );
};

export default LearningModule;
