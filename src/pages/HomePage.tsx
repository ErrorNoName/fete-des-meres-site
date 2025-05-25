import React from 'react';
import MessageForm from '../components/MessageForm';
import SpeedControl from '../components/SpeedControl';
import ShareLink from '../components/ShareLink';
import { Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="inline-block mb-4">
            <Heart className="w-16 h-16 text-pink-400 mx-auto animate-pulse" />
          </div>
          <h1 className="text-3xl font-light mb-2">Fête des Mères</h1>
          <p className="text-lg font-extralight opacity-80">
            Créez une animation personnalisée pour célébrer votre maman
          </p>
        </header>
        
        <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10">
          <p className="text-center mb-8 font-light text-gray-300">
            Personnalisez les messages qui apparaîtront pendant l'animation, ajustez la vitesse, puis générez un lien unique à partager.
          </p>
          
          <div className="space-y-8">
            <MessageForm />
            <hr className="border-gray-700" />
            <SpeedControl />
            <hr className="border-gray-700" />
            <ShareLink />
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              Pour vivre l'expérience, secouez votre téléphone pour faire avancer l'animation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;