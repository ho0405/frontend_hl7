'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Footer from '../penguinChatbot/footer';
import ServiceItem from '../components/servicespage';

/**
 * ServicePage serves as a dedicated page to showcase various services offered. It features dynamic theming with a dark mode toggle,
 * a navigation bar for site-wide navigation, and a footer for additional information. The main content of the page is
 * rendered using the ServiceItem component, which lists all available services dynamically depending on the dark mode state.
 *
 * The dark mode state is managed locally within this component, and the page layout adjusts stylistically based on this state.
 *
 * @component
 * @returns {React.ReactElement} A complete service display page with header, service listing, and footer.
 */

function ServicePage() {
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
        <ServiceItem isDarkMode={isDarkMode}/>
      </div>
      <footer className="p-5 shadow-inner">
      <Footer isDarkMode={isDarkMode} />

      </footer>
    </div>
  );
}

export default ServicePage;
