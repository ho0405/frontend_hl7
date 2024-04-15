"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import LiveChatbot from '../chatbot/page'; // Ensure this import path is correct
import Footer from '../penguinChatbot/footer';
import Image from 'next/image';
import '../../styles/globals.css';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Classes for dark and light themes
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>

      {/* Navigation Bar */}
      <nav className={`p-5 shadow-md rounded-lg mt-5 mx-5 ${cardClass}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <img src="images/logo.png" alt="Logo" className="h-12 w-28 mr-4 cursor-pointer" />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <Link href="/journal" className="hover:text-blue-500">Convert</Link>
            <Link href="/services" className="hover:text-blue-500">Services</Link>
            <Link href="/connect" className="hover:text-blue-500">Contact Us</Link>
            <Link href="/communicate" className="hover:text-blue-500">Communicate</Link>
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Live Chatbot */}
      <div className="flex-grow flex items-center justify-center">
        <LiveChatbot isDarkMode={isDarkMode}/>
      </div>

      {/* Footer */}
      <footer className="p-5 shadow-inner">
      <Footer isDarkMode={isDarkMode} />

      </footer>
    </div>
  );
};

export default HomePage;
