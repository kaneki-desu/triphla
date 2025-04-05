'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const QUIZ_API = process.env.NEXT_PUBLIC_QUIZ_API || "https://triphla-quiz.onrender.com/quiz";

export default function QuizComponent() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const generateQuiz = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(QUIZ_API, {
                num_questions: 5,
                topic: "finance"
            });
            setQuestions(response.data[0]);
            setCurrentQuestion(0);
            setScore(0);
            setShowResults(false);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } catch (err) {
            setError('Failed to generate quiz. Please try again.');
            console.error('Error generating quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQ = questions[currentQuestion];
        setSelectedAnswer(selectedOption);
        setShowExplanation(true);

        if (selectedOption === currentQ.correct_option) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setShowResults(true);
        }
    };

    const getOptionStyle = (option) => {
        if (!selectedAnswer) return "border border-base-300 hover:bg-base-300";
        
        const currentQ = questions[currentQuestion];
        const isCorrect = option === currentQ.correct_option;
        const isSelected = option === selectedAnswer;
        
        if (isCorrect) {
            return "border-2 border-success border-green-700 bg-success/10";
        }
        if (isSelected && !isCorrect) {
            return "border-2 border-error border-red-500 bg-error/10";
        }
        return "border border-base-300 opacity-50";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-error mb-4">{error}</p>
                <button 
                    className="btn btn-primary"
                    onClick={generateQuiz}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center p-4">
                <button 
                    className="btn btn-primary"
                    onClick={generateQuiz}
                >
                    Start Quiz
                </button>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="text-center p-4">
                <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                <p className="text-xl mb-4">Your score: {score} out of {questions.length}</p>
                <button 
                    className="btn btn-primary"
                    onClick={generateQuiz}
                >
                    Try Another Quiz
                </button>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-70">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm opacity-70">
                        Score: {score}
                    </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2.5">
                    <div 
                        className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
                <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${getOptionStyle(option)}`}
                            onClick={() => !selectedAnswer && handleAnswer(option)}
                            disabled={!!selectedAnswer}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {showExplanation && (
                    <div className="mt-4">
                        <div className="p-4 bg-base-300 rounded-lg mb-4">
                            <p className="text-sm opacity-90">{currentQ.answer_explanation}</p>
                        </div>
                        <button 
                            className="btn btn-primary w-full"
                            onClick={handleNextQuestion}
                        >
                            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 