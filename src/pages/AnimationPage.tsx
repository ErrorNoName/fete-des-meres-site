import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AnimationScene from '../components/AnimationScene';
import { ArrowLeft } from 'lucide-react';

const AnimationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Lock screen orientation to portrait
  useEffect(() => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait')
        .catch(error => console.error('Failed to lock screen orientation:', error));
    }
    
    // Ensure fullscreen mode if available
    const enterFullscreen = () => {
      const doc = document.documentElement;
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(err => console.log(err));
      }
      setHasInteracted(true);
    };
    
    document.addEventListener('click', enterFullscreen, { once: true });
    
    return () => {
      document.removeEventListener('click', enterFullscreen);
      
      // Exit fullscreen when leaving
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    };
  }, []);

  // Prevent screen from sleeping
  useEffect(() => {
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };
    
    requestWakeLock();
    
    return () => {
      if (wakeLock) wakeLock.release().catch((err: Error) => console.error(err));
    };
  }, []);
  
  if (!id) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl mb-6">Animation non trouvée</p>
        <Link 
          to="/" 
          className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <AnimationScene id={id} />
      
      {/* Back button */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 z-50 p-2 bg-black/30 rounded-full text-white backdrop-blur-sm"
        onClick={() => {
          // Exit fullscreen when navigating back
          if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
          }
        }}
      >
        <ArrowLeft size={20} />
      </Link>
    </>
  );
};

export default AnimationPage;