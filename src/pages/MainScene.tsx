import React, { useEffect, useState } from 'react';
import { LuminousSphere } from '../components/LuminousSphere';
import { AudioPlayer } from '../components/AudioPlayer';
import Particles from '@tsparticles/react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Ma douce maman, tu es ma lumière",
  "Ton amour guide mes pas",
  "Dans tes bras, je trouve mon refuge",
  "Merci d'être là, simplement toi",
  "Tu es mon étoile, ma force, mon inspiration"
];

const symbols = ['★', '✧', '❀', '✿', '✦'];

const poeticFont = {
  fontFamily: '"Dancing Script", "Great Vibes", cursive',
  fontWeight: 400,
  letterSpacing: '0.04em',
};

function Landscape() {
  // SVG paysage mystique avec montagnes, arbres, reflets, brouillard
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" style={{zIndex:1}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d1b47" />
          <stop offset="100%" stopColor="#e0b7e6" />
        </linearGradient>
        <radialGradient id="fog" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#sky)" />
      {/* Montagnes */}
      <path d="M0 900 Q400 700 800 900 T1920 900 V1080 H0Z" fill="#2d1b47" />
      <path d="M0 950 Q600 800 1200 950 T1920 950 V1080 H0Z" fill="#3a235a" />
      {/* Arbres silhouettes */}
      <g opacity="0.7">
        <rect x="300" y="800" width="20" height="100" fill="#1a102b" />
        <ellipse cx="310" cy="800" rx="40" ry="60" fill="#1a102b" />
        <rect x="1600" y="820" width="18" height="80" fill="#1a102b" />
        <ellipse cx="1609" cy="820" rx="32" ry="48" fill="#1a102b" />
      </g>
      {/* Reflets d'eau */}
      <ellipse cx="960" cy="1040" rx="400" ry="30" fill="#fff" opacity="0.08" />
      {/* Brouillard */}
      <rect y="800" width="1920" height="280" fill="url(#fog)" />
    </svg>
  );
}

function Fireflies() {
  // Particules lucioles animées
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 40 },
          color: { value: '#fffbe6' },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.4, max: 0.9 } },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' },
          },
          twinkle: { particles: { enable: true, frequency: 0.2, color: { value: '#fffbe6' } } },
        },
        detectRetina: true,
      }}
      style={{ position: 'absolute', inset: 0, zIndex: 2 }}
    />
  );
}

function StarSky() {
  // Ciel étoilé animé
  return (
    <Particles
      id="starsky"
      options={{
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 120 },
          color: { value: '#fff' },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.2, max: 0.7 } },
          size: { value: { min: 0.5, max: 1.5 } },
          move: {
            enable: true,
            speed: 0.08,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'out' },
          },
        },
        detectRetina: true,
      }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}

function PoeticMessage({ message, symbol }: { message: string; symbol: string }) {
  // Apparition lettre par lettre, ornements, police élégante
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (i < message.length) {
          const next = prev + message[i];
          i++;
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 55);
    return () => clearInterval(interval);
  }, [message]);
  return (
    <div className="flex flex-col items-center mt-8 select-none">
      <div className="text-4xl md:text-5xl text-white drop-shadow-lg relative" style={poeticFont}>
        <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-pink-200 text-3xl">❦</span>
        <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-pink-200 text-3xl">❦</span>
        <span className="mx-4">{displayed}</span>
      </div>
      <motion.div
        className="mt-4 text-3xl text-pink-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        key={symbol}
      >
        {symbol}
      </motion.div>
    </div>
  );
}

function MotherAndChild({ progress }: { progress: number }) {
  // La mère (silhouette) se rapproche de l'enfant (sphère) selon progress (0 à 1)
  // progress = currentMessage / (messages.length - 1)
  const startX = 400, endX = 960; // px, mère part de la gauche vers le centre
  const y = 900;
  const motherX = startX + (endX - startX) * progress;
  return (
    <svg className="absolute left-0 top-0 w-full h-full pointer-events-none" style={{zIndex: 10}} viewBox="0 0 1920 1080">
      {/* Mère silhouette */}
      <g transform={`translate(${motherX},${y})`}>
        <ellipse cx="0" cy="0" rx="32" ry="48" fill="#fff8e7" opacity="0.9" />
        <rect x="-12" y="40" width="24" height="60" rx="12" fill="#fff8e7" opacity="0.9" />
        {/* bras */}
        <rect x="-32" y="60" width="20" height="8" rx="4" fill="#fff8e7" opacity="0.7" />
        <rect x="12" y="60" width="20" height="8" rx="4" fill="#fff8e7" opacity="0.7" />
      </g>
      {/* Enfant (sphère) au centre */}
      <g transform="translate(960,900)">
        <ellipse cx="0" cy="0" rx="22" ry="32" fill="#ffe7b7" opacity="0.95" />
      </g>
    </svg>
  );
}

function Flowers() {
  // Fleurs stylisées au sol
  return (
    <svg className="absolute left-0 bottom-0 w-full h-40 pointer-events-none" style={{zIndex: 5}} viewBox="0 0 1920 160">
      <g>
        <ellipse cx="200" cy="120" rx="8" ry="18" fill="#f9d6f7" />
        <ellipse cx="220" cy="130" rx="6" ry="14" fill="#b7e6e0" />
        <ellipse cx="400" cy="140" rx="10" ry="20" fill="#ffe7b7" />
        <ellipse cx="600" cy="120" rx="7" ry="15" fill="#e0b7e6" />
        <ellipse cx="1700" cy="130" rx="8" ry="18" fill="#f9d6f7" />
        <ellipse cx="1500" cy="140" rx="10" ry="20" fill="#ffe7b7" />
      </g>
    </svg>
  );
}

function Butterflies() {
  // Papillons animés
  return (
    <svg className="absolute left-0 top-0 w-full h-full pointer-events-none" style={{zIndex: 6}} viewBox="0 0 1920 1080">
      <g>
        <motion.g animate={{ y: [0, -20, 0], x: [0, 40, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="300" cy="900" rx="8" ry="4" fill="#fffbe6" />
          <ellipse cx="308" cy="900" rx="8" ry="4" fill="#f9d6f7" />
        </motion.g>
        <motion.g animate={{ y: [0, -30, 0], x: [0, -60, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
          <ellipse cx="1700" cy="950" rx="7" ry="3" fill="#b7e6e0" />
          <ellipse cx="1707" cy="950" rx="7" ry="3" fill="#e0b7e6" />
        </motion.g>
      </g>
    </svg>
  );
}

function AnimatedFog() {
  // Brouillard mouvant
  return (
    <motion.div
      className="absolute left-0 bottom-0 w-full h-1/2 pointer-events-none"
      style={{ zIndex: 4, background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 100%)' }}
      animate={{ x: [0, 40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export const MainScene: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = currentMessage / (messages.length - 1);
  const isEnd = currentMessage === messages.length - 1;

  // Désactive l'auto-next, passe à l'interaction manuelle
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentMessage((prev) => (prev + 1) % messages.length);
  //   }, 8000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleNext = () => {
    if (!isEnd) setCurrentMessage((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans" style={{background: 'linear-gradient(to bottom, #2d1b47 0%, #e0b7e6 100%)'}}>
      <Landscape />
      <StarSky />
      <Fireflies />
      <Flowers />
      <Butterflies />
      <AnimatedFog />
      <MotherAndChild progress={progress} />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
        <LuminousSphere playing={isPlaying} />
        <AnimatePresence mode="wait">
          <PoeticMessage
            key={currentMessage}
            message={messages[currentMessage]}
            symbol={symbols[currentMessage % symbols.length]}
          />
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-auto">
        <AudioPlayer onPlayingChange={setIsPlaying} />
        {!isEnd && (
          <button
            onClick={handleNext}
            className="mx-auto mt-8 block bg-pink-200/80 hover:bg-pink-300 text-pink-900 font-bold py-3 px-8 rounded-full shadow-lg text-xl transition-all"
            style={{ pointerEvents: 'auto' }}
          >
            Voir le message suivant
          </button>
        )}
        {isEnd && (
          <div className="text-center mt-8 text-3xl text-pink-100 font-poetic drop-shadow-lg animate-bounce">
            Maman et enfant réunis 💞
          </div>
        )}
      </div>
    </div>
  );
};
