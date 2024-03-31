"use client"
import { useState, useEffect } from 'react';

const LiveChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => {
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(true);
    }, 5000); 
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <div className="bg-white p-3 rounded-full shadow-lg transition duration-500 ease-in-out transform hover:scale-110">
          <button onClick={openChatbot}>
            <img src="images/chatbot.png" alt="Chatbot" className="h-12 w-14" />
          </button>
        </div>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-600">
              <p>Chatbot: Any questions? Connect with us now!</p>
            </div>
          </div>
          <div className="mt-4">
            <input type="text" placeholder="..." className="border rounded-md px-2 py-1 w-full" />
          </div>
          <div className="mt-2 text-right">
            <button onClick={closeChatbot} className="text-sm text-gray-500 hover:text-gray-700">
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChatbot;
