import React, { useState } from 'react';
import 'animate.css';


interface SplashScreenProps {
  onAnimationEnd: () => void; 
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const [selected, setSelected] = useState<string | null>(null); // State for tracking which card was selected

  const handleCardClick = (side: string) => {
    setSelected(side);
    setTimeout(() => {
      onAnimationEnd(); 
    }, 1000); 
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`flex-1 flex items-center justify-center bg-blue-300 cursor-pointer transition-transform duration-300 ease-in-out ${
          selected === 'left' ? 'animate__animated animate__zoomOut' : ''
        }`}
        onClick={() => handleCardClick('left')}
      >
        Left Card
      </div>
      <div
        className={`flex-1 flex items-center justify-center bg-red-300 cursor-pointer transition-transform duration-300 ease-in-out ${
          selected === 'right' ? 'animate__animated animate__zoomOut' : ''
        }`}
        onClick={() => handleCardClick('right')}
      >
        Right Card
      </div>
    </div>
  );
};

export default SplashScreen;
