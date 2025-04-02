"use client";
import { useState, useEffect } from "react";
import Link from 'next/link'; // Import Link for navigation

const BidirectionalSlider = ({ news }) => {
  // Handle potential null/empty news prop gracefully
  if (!news || news.length === 0) {
    return <div className="text-center p-4">No news available.</div>;
  }

  // Split the news array into two halves
  const midpoint = Math.ceil(news.length / 2);
  const news1 = news.slice(0, midpoint);
  const news2 = news.slice(midpoint);

  const SPEED = 1; // Adjusted speed slightly
  const ITEM_WIDTH = 350; // Width of each news item container

  // Calculate widths for each slider
  const totalWidth1 = news1.length * ITEM_WIDTH;
  const totalWidth2 = news2.length * ITEM_WIDTH;

  const [leftPosition1, setLeftPosition1] = useState(0);
  const [rightPosition2, setRightPosition2] = useState(-totalWidth2); // Initialize based on news2 length

  useEffect(() => {
    // Ensure widths are calculated correctly before effect runs
    const currentTotalWidth1 = news1.length * ITEM_WIDTH;
    const currentTotalWidth2 = news2.length * ITEM_WIDTH;

    // Initialize right position based on actual news2 length if it changed
    if (rightPosition2 === -totalWidth2) { // Check if it's the initial state or needs update
        setRightPosition2(-currentTotalWidth2);
    }


    const animateSliders = () => {
      // Top slider (news1): moves left to right
      setLeftPosition1((prev) => (prev >= currentTotalWidth1 ? -ITEM_WIDTH : prev + SPEED)); // Reset smoothly based on news1

      // Bottom slider (news2): moves right to left
      setRightPosition2((prev) => (prev >= 0 ? -currentTotalWidth2 : prev + SPEED)); // Reset smoothly based on news2
    };

    const animationId = setInterval(animateSliders, 20); // Slightly slower interval
    return () => clearInterval(animationId);
  }, [news1.length, news2.length, rightPosition2, totalWidth2]); // Depend on lengths of news arrays

  return (
    <div className="relative w-full overflow-hidden h-96">
      {/* Top slider (left to right) */}
      <div
        className="absolute flex"
        style={{ transform: `translateX(-${leftPosition1}px)`, whiteSpace: "nowrap" }}
      >
        {/* Use news1 for the top slider */}
        {[...news1, ...news1].map((newsItem, index) => {
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
        {/* Use news2 for the bottom slider */}
        {[...news2, ...news2].map((newsItem, index) => {
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
