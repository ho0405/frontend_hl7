"use client"
import React, { useState, useEffect } from "react";
import { db, auth } from "../_utils/firebase"; 
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext"; 

const LiveChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = UserAuth(); // Assuming UserAuth is your context for user information

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: user.email, 
      userId: user.uid,
    });
    setNewMessage("");
  };

  const handleDelete = async (messageId) => {
    await deleteDoc(doc(db, "messages", messageId));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-white p-3 rounded-full shadow-lg flex items-center justify-center">
          <img src="/images/chatbot.png" alt="Chatbot" className="h-12 w-14" />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 w-80 max-h-96 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {messages.map(({ id, user, text, createdAt, userId }) => (
            <div key={id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <div>
                <strong>{user}</strong>
                <span style={{ fontSize: '0.8rem', marginLeft: '5px' }}>{createdAt}</span>
                {userId === auth.currentUser.uid && (
                  <button
                    onClick={() => handleDelete(id)}
                    style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Delete message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
              </div>
              <p>{text}</p>
            </div>
          ))}
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full p-2 border rounded"
              placeholder="Type your message here..."
              style={{ resize: 'none', marginBottom: '10px' }}
            ></textarea>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Send
            </button>
          </form>
          <button onClick={() => setIsOpen(false)} className="mt-4 w-full text-gray-500 hover:text-gray-700">
            Close Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveChatbot;
