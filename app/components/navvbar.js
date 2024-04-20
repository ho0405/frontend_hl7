'use client'
import { useState } from "react";
import React from 'react';
import Link from "next/link";
import ThemeSwitcher from './ThemeSwitcher';
import '../../styles/globals.css';

/**
 * NavvBar is a navigation component that displays links to various pages of the application.
 * It includes a theme switcher that allows users to toggle between dark and light mode,
 * affecting the styling of the navigation bar and potentially the entire application.
 *
 * The component uses state to keep track of whether dark mode is enabled and applies
 * appropriate CSS classes based on this state to change the appearance of the navigation bar.
 *
 * @component
 * @returns {React.ReactElement} A navigation bar with theme-switching functionality.
 */

const NavvBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); 

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : ' text-black';
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
            <Link href="/services" className="hover:text-blue-500">Services</Link>
            <Link href="/connect" className="hover:text-blue-500">Contact Us</Link>
            <Link href="/communicate" className="hover:text-blue-500">Communicate</Link>
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavvBar;



