'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ContactCard from '../components/contactcard';

function ConnectPage() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <nav className={`p-4 shadow-md rounded-lg mt-4 mx-10 ${cardClass}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="images/logo.png" alt="Logo" className="h-12 w-28 mr-4" />
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <Link href="/journal" className="hover:text-blue-500">Convert</Link>
            <Link href="/connect" className="hover:text-blue-500">Connect Us</Link>
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>
      <div className="mx-10 my-6">
        <ContactCard />
      </div>
    </div>
  );
}

export default ConnectPage;
