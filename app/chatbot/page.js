"use client"
import React, { useState, useEffect } from 'react';
import { db, auth } from '../_utils/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import { UserAuth } from '../context/AuthContext';
/**
 * LiveChatbot is a component that displays a live chat interface where messages are
 * fetched in real-time from Firestore, and users can post new messages.
 *
 * It uses Firebase for authentication and real-time database operations. It generates
 * random avatars for users using @dicebear/personas. It handles loading states, message
 * submission, and message deletion functionality.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isDarkMode - A boolean flag indicating if the component should use dark mode styles.
 * @returns {React.ReactElement} A component that renders the chat UI with real-time message updates.
 */

const LiveChatbot = ({ isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = UserAuth();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString(),
      }));
      setMessages(loadedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // This function generates an SVG avatar string using @dicebear/personas
  const getRandomAvatar = (userId) => {
    const options = { seed: userId }; // Customize options as needed
    const svgAvatar = createAvatar(personas, options);
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgAvatar)}`;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user.email,
      userId: user.uid,
    });
    setNewMessage('');
  };

  const handleDelete = async messageId => {
    await deleteDoc(doc(db, 'messages', messageId));
  };

  const containerClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const messageClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-black';

  return (
    <div className={`flex items-center justify-center mt-10 ${containerClass} rounded-lg`}>
      <div className={`rounded-lg shadow-lg p-3 w-full min-w-lg space-y-6 ${cardClass}`}>
        {loading && <p className="text-center">Loading...</p>}
        {!loading && messages.map(({ id, user, text, createdAt, userId }) => (
          <div key={id} className={`p-2 mb-2 rounded-lg border ${messageClass}`}>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <img src={getRandomAvatar(userId)} alt="User Avatar" className="w-8 h-8 rounded-full mr-2"/>
                <strong className="font-semibold">{user}</strong>
                <span className="ml-2 text-gray-500">{createdAt}</span>
              </div>
              {userId === auth.currentUser?.uid && (
                <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-800">
                  <span className="sr-only">Delete message</span>🗑️
                </button>
              )}
            </div>
            <p className="mt-2">{text}</p>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="pt-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className={`w-full p-3 border ${isDarkMode ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Type your message here..."
            rows="3"
          ></textarea>
          <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveChatbot;