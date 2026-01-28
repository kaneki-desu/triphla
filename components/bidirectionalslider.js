"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'; // Import Link for navigation

const BidirectionalSlider = ({ news = [] }) => {
  // 🛑 EARLY EXIT — before using news.length
  if (!Array.isArray(news) || news.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        No news available
      </div>
    );
  }

  const ITEM_WIDTH = 350;
  const SPEED = 1;

  // Split the news array
  const midpoint = Math.ceil(news.length / 2);
  const news1 = news.slice(0, midpoint);
  const news2 = news.slice(midpoint);

  const totalWidth1 = news1.length * ITEM_WIDTH;
  const totalWidth2 = news2.length * ITEM_WIDTH;

  const [leftPosition1, setLeftPosition1] = useState(0);
  const [rightPosition2, setRightPosition2] = useState(-totalWidth2);

  useEffect(() => {
    const animateSliders = () => {
      setLeftPosition1((prev) =>
        prev >= totalWidth1 ? -ITEM_WIDTH : prev + SPEED
      );

      setRightPosition2((prev) =>
        prev >= 0 ? -totalWidth2 : prev + SPEED
      );
    };

    const id = setInterval(animateSliders, 20);
    return () => clearInterval(id);
  }, [totalWidth1, totalWidth2]);
}

export default BidirectionalSlider;
