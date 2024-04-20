'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ContactCard from '../components/contactcard';
import Footer from '../penguinChatbot/footer';

/**
 * ConnectPage serves as a contact page within the application. It includes a navigation bar,
 * a contact card with dynamic theming, and a footer. The page allows users to toggle between dark and light
 * themes which affects the overall styling of all components on the page.
 *
 * The navigation bar provides links to various sections of the site, while the contact card displays
 * detailed contact information. The footer provides additional links or company information.
 *
 * @component
 * @returns {React.ReactElement} The ConnectPage component which includes navigation, contact information, and footer.
 */
function ConnectPage() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      {}
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

      <div className="mx-10 my-6">
        <ContactCard isDarkMode={isDarkMode} />
      </div>
      <footer className="p-5 shadow-inner">
      <Footer isDarkMode={isDarkMode} />

      </footer>
    </div>
  );
}

export default ConnectPage;
