"use client";
import { useState, useEffect, useRef } from "react";

const BidirectionalSlider = ({ images }) => {
  const SPEED = 2; // Adjust speed as needed
  const IMAGE_WIDTH = 300; // Width of each image
  const TOTAL_WIDTH = images.length * IMAGE_WIDTH;

  const [leftPosition1, setLeftPosition1] = useState(0);
  const [rightPosition2, setRightPosition2] = useState(-TOTAL_WIDTH);

  useEffect(() => {
    const animateSliders = () => {
      // Top slider: moves left to right
      setLeftPosition1((prev) => (prev >= TOTAL_WIDTH ? 0 : prev + SPEED));
      
      // Bottom slider: moves right to left (continuous loop)
      setRightPosition2((prev) => {
        // If the slider has moved past its starting point, reset to the initial negative position
        if (prev >= 0) {
          return -TOTAL_WIDTH;
        }
        // Otherwise, continue moving
        return prev + SPEED;
      });
    };

    const animationId = setInterval(animateSliders, 10);
    return () => clearInterval(animationId);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden h-96">
      {/* Top slider (left to right) */}
      <div
        className="absolute flex"
        style={{ transform: `translateX(-${leftPosition1}px)`, whiteSpace: "nowrap" }}
      >
        {[...images, ...images].map((image, index) => (
          <div key={`slider1-${index}`} className="min-w-[300px] h-40 p-2">
            <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom slider (right to left) */}
      <div
        className="absolute flex top-44"
        style={{ transform: `translateX(${rightPosition2}px)`, whiteSpace: "nowrap" }}
      >
        {[...images, ...images].map((image, index) => (
          <div key={`slider2-${index}`} className="min-w-[300px] h-40 p-2">
            <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidirectionalSlider;