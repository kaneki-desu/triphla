'use client';   
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const lessons = [
  {
    id: 1,
    term: "Stocks",
    description: "A stock represents a share in the ownership of a company.",
    question: "What does owning a stock mean?",
    options: [
      "You own a part of the company",
      "You loan money to the company",
      "You get fixed interest from the company",
    ],
    answer: 0,
  },
  {
    id: 2,
    term: "Bonds",
    description: "A bond is a fixed-income investment where investors loan money.",
    dragAndDrop: {
      items: ["Loaning money", "Owning shares", "Receiving dividends"],
      correct: "Loaning money",
    },
  },
];

const FinancialLearningModule = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleQuizSubmit = () => {
    if (selectedAnswer === lessons[currentStep].answer) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handleDrop = (item) => {
    if (item === lessons[currentStep].dragAndDrop.correct) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {currentStep < lessons.length ? (
        <Card className="w-96 p-4 shadow-lg">
          <CardContent>
            <motion.h2
              className="text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {lessons[currentStep].term}
            </motion.h2>
            <p className="mt-2">{lessons[currentStep].description}</p>
            {lessons[currentStep].question ? (
              <div className="mt-4">
                {lessons[currentStep].options.map((opt, index) => (
                  <Button
                    key={index}
                    className={`w-full mt-2 ${
                      selectedAnswer === index ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => setSelectedAnswer(index)}
                  >
                    {opt}
                  </Button>
                ))}
                <Button
                  className="mt-4 w-full bg-green-500 text-white"
                  onClick={handleQuizSubmit}
                >
                  Submit Answer
                </Button>
              </div>
            ) : lessons[currentStep].dragAndDrop ? (
              <div className="mt-4">
                <p>Drag and drop the correct definition:</p>
                <div className="mt-2 flex space-x-4">
                  {lessons[currentStep].dragAndDrop.items.map((item, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDraggedItem(item)}
                      className="p-2 bg-gray-300 rounded cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 p-4 bg-gray-100 rounded text-center border-dashed border-2 border-gray-500"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(draggedItem)}
                >
                  Drop here
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <h2 className="text-2xl font-bold">You’ve completed the module!</h2>
      )}
    </div>
  );
};

export default FinancialLearningModule;
