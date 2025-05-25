import React, { useState } from 'react';
import { useAnimation } from '../context/AnimationContext';
import { Share2, Copy, Check } from 'lucide-react';

const ShareLink: React.FC = () => {
  const { id, generateNewId } = useAnimation();
  const [copied, setCopied] = useState(false);
  const [animationLink, setAnimationLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    const newId = await generateNewId();
    const link = `${window.location.origin}/animation/${newId}`;
    setAnimationLink(link);
    setCopied(false);
    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(animationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <h2 className="text-xl font-light mb-4">Partager l'animation</h2>
      
      <button
        onClick={handleGenerateLink}
        className="w-full py-3 bg-purple-600 text-white rounded-md flex items-center justify-center mb-4 disabled:opacity-60"
        disabled={loading}
      >
        <Share2 size={18} className="mr-2" />
        {loading ? 'Génération en cours...' : 'Générer un lien unique'}
      </button>
      
      {animationLink && (
        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              value={animationLink}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none bg-transparent"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-gray-200 rounded-r-md flex items-center"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Partagez ce lien avec votre mère pour qu'elle puisse voir votre animation personnalisée.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareLink;