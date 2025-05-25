import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onPlayingChange: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<Props> = ({ onPlayingChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambienceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ambienceRef.current) {
      ambienceRef.current.volume = 0.3;
      ambienceRef.current.loop = true;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current && ambienceRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        ambienceRef.current.pause();
      } else {
        audioRef.current.play();
        ambienceRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayingChange(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
      <motion.button
        onClick={togglePlay}
        className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? '❚❚' : '▶'}
        <span className="ml-2">Musique</span>
      </motion.button>

      <audio ref={audioRef} src="/music/zen-mother.mp3" />
      <audio ref={ambienceRef} src="/music/ambience.mp3" />
    </div>
  );
};
