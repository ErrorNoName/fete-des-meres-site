import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  message: string;
}

export const FloatingMessage: React.FC<Props> = ({ message }) => {
  return (
    <motion.div
      className="text-white text-2xl font-poetic mt-8 text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.5 }}
    >
      {message}
    </motion.div>
  );
};
