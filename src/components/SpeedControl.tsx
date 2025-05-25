import React from 'react';
import { useAnimation } from '../context/AnimationContext';

const SpeedControl: React.FC = () => {
  const { speed, setSpeed } = useAnimation();

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <h2 className="text-xl font-light mb-4">Vitesse de l'animation</h2>
      
      <div className="mb-2 flex justify-between text-xs text-gray-500">
        <span>Lent</span>
        <span>Rapide</span>
      </div>
      
      <input
        type="range"
        min="1"
        max="10"
        value={speed}
        onChange={(e) => setSpeed(parseInt(e.target.value))}
        className="w-full accent-purple-500"
      />
      
      <div className="mt-2 text-center">
        <span className="text-sm">Valeur actuelle: {speed}</span>
      </div>
    </div>
  );
};

export default SpeedControl;