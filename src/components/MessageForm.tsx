import React, { useState } from 'react';
import { useAnimation, Message } from '../context/AnimationContext';
import { Trash2, Edit, Save, Plus } from 'lucide-react';

const MessageForm: React.FC = () => {
  const { messages, addMessage, removeMessage, updateMessage } = useAnimation();
  const [newMessage, setNewMessage] = useState('');
  const [newPosition, setNewPosition] = useState(50);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (editingId) {
        updateMessage(editingId, newMessage, newPosition);
        setEditingId(null);
      } else {
        addMessage(newMessage, newPosition);
      }
      setNewMessage('');
      setNewPosition(50);
    }
  };

  const startEditing = (message: Message) => {
    setEditingId(message.id);
    setNewMessage(message.text);
    setNewPosition(message.position);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewMessage('');
    setNewPosition(50);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-light mb-4">Messages personnalisés</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-light mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 bg-transparent"
            placeholder="Écrivez votre message..."
            rows={2}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-light mb-1">
            Position dans le parcours: {newPosition}%
          </label>
          <input
            id="position"
            type="range"
            min="0"
            max="100"
            value={newPosition}
            onChange={(e) => setNewPosition(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
        
        <div className="flex justify-between">
          {editingId ? (
            <>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center"
              >
                <Save size={16} className="mr-1" /> Sauvegarder
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-md flex items-center"
            >
              <Plus size={16} className="mr-1" /> Ajouter
            </button>
          )}
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="text-lg font-light mb-2">Messages ({messages.length})</h3>
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">Aucun message. Ajoutez-en un !</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((message) => (
              <li 
                key={message.id} 
                className={`p-3 border border-gray-200 rounded-md flex justify-between items-start ${
                  editingId === message.id ? 'bg-purple-50' : ''
                }`}
              >
                <div>
                  <p className="mb-1">{message.text}</p>
                  <span className="text-xs text-gray-500">Position: {message.position}%</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(message)}
                    className="text-gray-500 hover:text-purple-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessageForm;