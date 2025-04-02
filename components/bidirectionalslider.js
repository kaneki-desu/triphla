"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'; // Import Link for navigation

const BidirectionalSlider = ({ news }) => {
  // Handle potential null/empty news prop gracefully
  if (!news || news.length === 0) {
    return <div className="text-center p-4">No news available.</div>;
  }

  const SPEED = 1; // Adjusted speed slightly
  const ITEM_WIDTH = 350; // Width of each news item container
  const TOTAL_WIDTH = news.length * ITEM_WIDTH;

  const [leftPosition1, setLeftPosition1] = useState(0);
  const [rightPosition2, setRightPosition2] = useState(-TOTAL_WIDTH);

  useEffect(() => {
    // Ensure TOTAL_WIDTH is calculated correctly before effect runs
    const currentTotalWidth = news.length * ITEM_WIDTH;
    setRightPosition2(-currentTotalWidth); // Initialize based on actual news length

    const animateSliders = () => {
      // Top slider: moves left to right
      setLeftPosition1((prev) => (prev >= currentTotalWidth ? -ITEM_WIDTH : prev + SPEED)); // Reset smoothly

      // Bottom slider: moves right to left (continuous loop)
      setRightPosition2((prev) => (prev >= 0 ? -currentTotalWidth : prev + SPEED)); // Reset smoothly
    };


    const animationId = setInterval(animateSliders, 20); // Slightly slower interval
    return () => clearInterval(animationId);
  }, [news.length]); // Depend on news.length

  return (
    <div className="relative w-full overflow-hidden h-96">
      {/* Top slider (left to right) */}
      <div
        className="absolute flex"
        style={{ transform: `translateX(-${leftPosition1}px)`, whiteSpace: "nowrap" }}
      >
        {[...news, ...news].map((newsItem, index) => {
          // Define radial gradient fading towards center (using white initially)
          const gradientStyle = newsItem.sentiment === "Bullish"
            ? "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0)_0%,_rgba(34,197,94,0.3)_95%)]" // Base to Green (semi-transparent)
            : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0)_0%,_rgba(239,68,68,0.3)_95%)]"; // Base to Red (semi-transparent)
          return (
            <div key={`slider1-${index}`} className={`min-w-[${ITEM_WIDTH}px] h-40 p-2`}>
              {/* Apply radial gradient style class */}
              <div className={`w-full h-full rounded-lg ${gradientStyle} p-4 flex items-center justify-center text-center overflow-hidden`}>
                <Link href={newsItem.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-lg"> {/* Keep text black for now */}
                  {newsItem.headline}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom slider (right to left) */}
      <div
        className="absolute flex top-44" // Adjust top position if needed
        style={{ transform: `translateX(${rightPosition2}px)`, whiteSpace: "nowrap" }}
      >
        {[...news, ...news].map((newsItem, index) => {
           // Define radial gradient fading towards center (using white initially)
           const gradientStyle = newsItem.sentiment === "Bullish"
             ? "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0),_rgba(34,197,94,0.3)_95%)]" // White to Green (semi-transparent)
             : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0),_rgba(239,68,68,0.3)_95%)]"; // White to Red (semi-transparent)
           return (
             <div key={`slider2-${index}`} className={`min-w-[${ITEM_WIDTH}px] h-40 p-2`}>
               {/* Apply radial gradient style class */}
               <div className={`w-full h-full rounded-lg ${gradientStyle} p-4 flex items-center justify-center text-center overflow-hidden`}>
                 <Link href={newsItem.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-lg"> {/* Keep text black for now */}
                   {newsItem.headline}
                 </Link>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default BidirectionalSlider;
