import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabaseClient';

export interface Message {
  id: string;
  text: string;
  position: number; // 0-100 (percentage of journey)
}

interface AnimationContextType {
  messages: Message[];
  speed: number;
  id: string;
  addMessage: (text: string, position: number) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, text: string, position: number) => void;
  setSpeed: (speed: number) => void;
  generateNewId: () => void;
  loadAnimation: (id: string) => void;
}

const defaultMessages: Message[] = [
  { id: uuidv4(), text: "Les souvenirs d'enfance restent gravés pour toujours", position: 15 },
  { id: uuidv4(), text: "Tu m'as appris à être fort et courageux", position: 30 },
  { id: uuidv4(), text: "Dans les moments difficiles, tu étais mon refuge", position: 45 },
  { id: uuidv4(), text: "Aujourd'hui, je veux te remercier pour tout", position: 60 },
  { id: uuidv4(), text: "L'avenir nous réserve encore de beaux moments ensemble", position: 75 },
  { id: uuidv4(), text: "Je t'aime maman", position: 90 }
];

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Nouvelle fonction pour sauvegarder l'animation sur Supabase
type AnimationData = { id: string; messages: Message[]; speed: number };

async function saveAnimationToSupabase(data: AnimationData) {
  await supabase.from('animations').upsert([data]);
}

async function loadAnimationFromSupabase(id: string): Promise<AnimationData | null> {
  const { data, error } = await supabase.from('animations').select('*').eq('id', id).single();
  if (error || !data) return null;
  return data as AnimationData;
}

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [speed, setSpeed] = useState<number>(5);
  const [id, setId] = useState<string>(uuidv4());

  const addMessage = (text: string, position: number) => {
    const newMessage: Message = {
      id: uuidv4(),
      text,
      position
    };
    setMessages([...messages, newMessage].sort((a, b) => a.position - b.position));
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const updateMessage = (id: string, text: string, position: number) => {
    setMessages(
      messages.map(message => 
        message.id === id 
          ? { ...message, text, position } 
          : message
      ).sort((a, b) => a.position - b.position)
    );
  };

  const generateNewId = async () => {
    const newId = uuidv4();
    setId(newId);
    // Sauvegarde sur Supabase
    await saveAnimationToSupabase({ id: newId, messages, speed });
    // Optionnel : sauvegarde locale aussi
    localStorage.setItem(newId, JSON.stringify({ messages, speed }));
    return newId;
  };

  const loadAnimation = async (id: string) => {
    // Tente de charger depuis Supabase
    const supa = await loadAnimationFromSupabase(id);
    if (supa) {
      setMessages(supa.messages);
      setSpeed(supa.speed);
      setId(id);
      return;
    }
    // Fallback localStorage
    const savedAnimation = localStorage.getItem(id);
    if (savedAnimation) {
      const { messages: savedMessages, speed: savedSpeed } = JSON.parse(savedAnimation);
      setMessages(savedMessages);
      setSpeed(savedSpeed);
      setId(id);
    }
  };

  const value = {
    messages,
    speed,
    id,
    addMessage,
    removeMessage,
    updateMessage,
    setSpeed,
    generateNewId,
    loadAnimation
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};