import React, { useEffect, useState } from 'react';
import { LuminousSphere } from '../components/LuminousSphere';
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

// Cœurs, fleurs, lucioles, étoiles, arc lumineux en pixel art
function PixelHeart({ filled = false }: { filled?: boolean }) {
  // Cœur pixel art
  return (
    <svg width="40" height="36" viewBox="0 0 40 36" style={{imageRendering:'pixelated', display:'inline'}}>
      <rect x="8" y="8" width="8" height="8" fill={filled ? '#ff6f91' : '#fff'} stroke="#c2185b" strokeWidth="2" />
      <rect x="24" y="8" width="8" height="8" fill={filled ? '#ff6f91' : '#fff'} stroke="#c2185b" strokeWidth="2" />
      <rect x="4" y="16" width="32" height="8" fill={filled ? '#ff6f91' : '#fff'} stroke="#c2185b" strokeWidth="2" />
      <rect x="12" y="24" width="16" height="8" fill={filled ? '#ff6f91' : '#fff'} stroke="#c2185b" strokeWidth="2" />
    </svg>
  );
}

function PixelFlower({ open = false }: { open?: boolean }) {
  // Fleur pixel art qui éclot
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{imageRendering:'pixelated'}}>
      <rect x="18" y="30" width="4" height="8" fill="#7fc97f" />
      {open ? (
        <>
          <rect x="16" y="20" width="8" height="8" fill="#fff59d" />
          <rect x="14" y="18" width="12" height="4" fill="#f9d6f7" />
        </>
      ) : (
        <rect x="18" y="22" width="4" height="8" fill="#fff59d" />
      )}
    </svg>
  );
}

function PixelFirefly({ lit = false }: { lit?: boolean }) {
  // Luciole pixel art
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{imageRendering:'pixelated', display:'inline'}}>
      <rect x="7" y="4" width="4" height="4" fill="#333" />
      <rect x="8" y="8" width="2" height="2" fill={lit ? '#ffe066' : '#bbb'} />
    </svg>
  );
}

function PixelStar({ glow = false }: { glow?: boolean }) {
  // Étoile pixel art
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" style={{imageRendering:'pixelated', display:'inline'}}>
      <rect x="10" y="2" width="4" height="8" fill="#fffde7" />
      <rect x="2" y="10" width="8" height="4" fill="#fffde7" />
      <rect x="14" y="10" width="8" height="4" fill="#fffde7" />
      <rect x="10" y="14" width="4" height="8" fill="#fffde7" />
      {glow && <rect x="6" y="6" width="12" height="12" fill="#ffe066" opacity="0.3" />}
    </svg>
  );
}

function PixelArc({ drawn = false }: { drawn?: boolean }) {
  // Arc lumineux pixel art
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" style={{imageRendering:'pixelated', display:'inline'}}>
      <rect x="0" y="20" width="48" height="4" fill="#b7e6e0" />
      {drawn && <rect x="8" y="12" width="32" height="4" fill="#ffe066" />}
    </svg>
  );
}

// Mini-jeux mignons pour chaque mot
function MiniGame({ step, onSuccess }: { step: number; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [blown, setBlown] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [drawn, setDrawn] = useState(false);
  if (step === 0) {
    // Relier deux cœurs pixel art
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-pink-200">Relie les deux cœurs pixelisés</div>
        <button
          className="hover:scale-110 transition-transform bg-transparent border-none"
          onClick={onSuccess}
        >
          <PixelHeart filled={true} />
          <span className="mx-2">→</span>
          <PixelHeart />
        </button>
      </div>
    );
  }
  if (step === 1) {
    // Fleur pixel art qui éclot
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-pink-200">Clique pour faire éclore la fleur pixel</div>
        <button
          className="transition-transform bg-transparent border-none"
          onClick={() => { setOpen(true); setTimeout(onSuccess, 700); }}
        >
          <PixelFlower open={open} />
        </button>
      </div>
    );
  }
  if (step === 2) {
    // Souffler sur des lucioles pixel art
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-pink-200">Souffle sur les lucioles pixel</div>
        <button
          className="hover:scale-110 transition-transform bg-transparent border-none"
          onClick={() => { setBlown(true); setTimeout(onSuccess, 700); }}
        >
          {blown ? <><PixelFirefly lit /><PixelFirefly lit /><PixelFirefly lit /></> : <><PixelFirefly /><PixelFirefly /><PixelFirefly /></>}
        </button>
      </div>
    );
  }
  if (step === 3) {
    // Glisser une étoile pixel art
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-pink-200">Fais glisser l'étoile pixel vers la lumière</div>
        <button
          className="hover:scale-110 transition-transform bg-transparent border-none"
          onClick={() => { setDragged(true); setTimeout(onSuccess, 700); }}
        >
          {dragged ? <PixelStar glow /> : <PixelStar />}
          <span className="mx-2">→</span>
          <span role="img" aria-label="lumière">💡</span>
        </button>
      </div>
    );
  }
  if (step === 4) {
    // Arc lumineux pixel art
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-pink-200">Trace un arc lumineux pixel</div>
        <button
          className="hover:scale-110 transition-transform bg-transparent border-none"
          onClick={() => { setDrawn(true); setTimeout(onSuccess, 700); }}
        >
          <PixelArc drawn={drawn} />
        </button>
      </div>
    );
  }
  return null;
}

export const MainScene: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = currentMessage / (messages.length - 1);
  const isEnd = currentMessage === messages.length - 1;
  const [showGame, setShowGame] = useState(true);

  const handleGameSuccess = () => {
    setShowGame(false);
    setTimeout(() => setShowGame(true), 1200);
    setTimeout(() => {
      if (!isEnd) setCurrentMessage((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative font-sans flex flex-col items-center justify-center bg-black" style={{background: 'linear-gradient(to bottom, #2d1b47 0%, #e0b7e6 100%)'}}>
      <PixelArtBackground />
      <StarSky />
      <Fireflies />
      <Flowers />
      <Butterflies />
      <AnimatedFog />
      <MotherAndChild progress={progress} />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-2">
        <LuminousSphere playing={isPlaying} />
        <AnimatePresence mode="wait">
          <PoeticMessage
            key={currentMessage}
            message={messages[currentMessage]}
            symbol={symbols[currentMessage % symbols.length]}
          />
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-auto flex flex-col items-center justify-center pb-4">
        {!isEnd && showGame && (
          <MiniGame step={currentMessage} onSuccess={handleGameSuccess} />
        )}
        {isEnd && (
          <div className="text-center mt-8 text-3xl text-pink-100 font-poetic drop-shadow-lg animate-bounce">
            Maman et enfant réunis 💞
          </div>
        )}
      </div>
    </div>
  );
}

// Nouveau décor pixel art animé
function PixelArtBackground() {
  // Fond 100% pixel art animé, responsive, parallax, étoiles scintillantes, lune, collines, château, arbres, buissons, fleurs
  // Plusieurs plans de nuages roses volumineux animés (parallax)
  // Étoiles scintillantes (opacité animée)
  // Lune pixel art
  // Collines, château, arbres, buissons, fleurs pixel art
  // Responsive : preserveAspectRatio="xMidYMid slice"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1280 720" style={{imageRendering: 'pixelated', zIndex: 0}} preserveAspectRatio="xMidYMid slice">
      {/* Ciel dégradé */}
      <defs>
        <linearGradient id="sky-pixel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d4e9e" />
          <stop offset="100%" stopColor="#e0b7e6" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#sky-pixel)" />
      {/* Lune pixel art */}
      <rect x="1120" y="60" width="24" height="24" fill="#fffbe6" rx="6" />
      <rect x="1132" y="72" width="8" height="8" fill="#e0b7e6" rx="2" />
      {/* Étoiles pixel art scintillantes */}
      <g>
        <motion.rect x="100" y="40" width="3" height="3" fill="#fff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.rect x="300" y="60" width="2" height="2" fill="#fff" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
        <motion.rect x="700" y="30" width="2" height="2" fill="#fff" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1 }} />
        <motion.rect x="900" y="90" width="2" height="2" fill="#fff" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }} />
        <motion.rect x="1200" y="50" width="2" height="2" fill="#fff" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.1, repeat: Infinity, delay: 1.2 }} />
      </g>
      {/* Nuages roses volumineux, parallax (3 plans) */}
      <g>
        <motion.rect x="80" y="120" width="420" height="60" rx="30" fill="#f9d6f7" animate={{ x: [80, 180, 80] }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} />
        <motion.rect x="600" y="80" width="320" height="50" rx="25" fill="#e0b7e6" animate={{ x: [600, 700, 600] }} transition={{ duration: 48, repeat: Infinity, ease: 'linear' }} />
        <motion.rect x="900" y="200" width="260" height="40" rx="20" fill="#f9d6f7" animate={{ x: [900, 1000, 900] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
      </g>
      {/* Collines pixel art */}
      <rect x="0" y="600" width="1280" height="80" fill="#4e3573" />
      <rect x="0" y="670" width="1280" height="50" fill="#2d1b47" />
      {/* Château pixel art */}
      <g>
        <rect x="1040" y="570" width="32" height="40" fill="#fffbe6" />
        <rect x="1052" y="550" width="8" height="20" fill="#b7e6e0" />
        <rect x="1060" y="560" width="8" height="10" fill="#e0b7e6" />
        <rect x="1050" y="590" width="12" height="20" fill="#ffe7b7" />
      </g>
      {/* Arbres, buissons, fleurs pixel art */}
      <g>
        {/* Arbres */}
        <rect x="200" y="620" width="10" height="38" fill="#fffbe6" />
        <rect x="220" y="630" width="8" height="28" fill="#b7e6e0" />
        <rect x="400" y="640" width="12" height="32" fill="#ffe7b7" />
        <rect x="600" y="625" width="8" height="36" fill="#e0b7e6" />
        <rect x="1100" y="630" width="10" height="34" fill="#f9d6f7" />
        {/* Buissons */}
        <rect x="250" y="690" width="12" height="12" fill="#b7e6e0" />
        <rect x="800" y="700" width="10" height="10" fill="#e0b7e6" />
        <rect x="900" y="710" width="14" height="10" fill="#f9d6f7" />
        {/* Fleurs */}
        <rect x="255" y="702" width="2" height="4" fill="#f9d6f7" />
        <rect x="805" y="702" width="2" height="4" fill="#ffe7b7" />
        <rect x="1200" y="715" width="2" height="4" fill="#ffe7b7" />
      </g>
    </svg>
  );
}
