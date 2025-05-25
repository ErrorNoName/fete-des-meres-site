import React, { useEffect, useState } from 'react';
import { LuminousSphere } from '../components/LuminousSphere';
import { FloatingMessage } from '../components/FloatingMessage';
import { AudioPlayer } from '../components/AudioPlayer';

const messages = [
  "Ma douce maman, tu es ma lumière",
  "Ton amour guide mes pas",
  "Dans tes bras, je trouve mon refuge",
  "Merci d'être là, simplement toi",
  "Tu es mon étoile, ma force, mon inspiration"
];

export const MainScene: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 overflow-hidden relative">
      <div className="absolute inset-0 bg-stars opacity-50" />
      
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
        <LuminousSphere playing={isPlaying} />
        <FloatingMessage message={messages[currentMessage]} />
      </div>

      <AudioPlayer onPlayingChange={setIsPlaying} />
    </div>
  );
};
