import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

/**
 * Footer component displays copyright information, a branding statement, and social media links. 
 * It supports theming and changes its appearance based on whether dark mode is active. 
 * The component is designed to adaptively show additional content and includes a script for integrating a chatbot.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isDarkMode - Indicates if the dark mode is enabled.
 * @returns {React.ReactElement} The footer of the application, containing links, copyright information, 
 * and an optional script for a chatbot integration.
 */

const Footer = ({ isDarkMode }) => {
  const footerClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const socialIconClass = isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-500';

  return (
    <footer className={`flex-1 p-10 rounded-lg flex-col md:flex-row justify-between items-center md:items-start p-10 ${footerClass}`}>
      <div className="mb-6 md:mb-0">
        <p className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hi7 Hl7</p>
        <p>&copy; 2024 Pureform & Pure kids Radiology</p>
        <div className="flex mt-4">
          <a href="https://www.facebook.com/PureformPureKidsRadiology/" className={`mr-4 ${socialIconClass}`}><FaFacebookF /></a>
          <a href="https://www.instagram.com/pureformradiology/?hl=en" className={`mr-4 ${socialIconClass}`}><FaInstagram /></a>
          <a href="https://twitter.com/i/flow/login?redirect_after_login=%2Fmypureform" className={`mr-4 ${socialIconClass}`}><FaTwitter /></a>
          <a href="https://www.youtube.com/channel/UCQjumPZiPAnPyybbQD8sr7A" className={`mr-4 ${socialIconClass}`}><FaYoutube /></a>
        </div>
      </div>
      <div className="flex flex-1 justify-around flex-wrap md:flex-nowrap">
        {/* Additional sections here */}
      </div>
      {/* Integrate the PenguinChat bot script */}
      <script id="messenger-widget-b" src="https://cdn.botpenguin.com/website-bot.js" defer>6617a30f578ae32182212ef5,66179d2a7866d122165f6ac5</script>
    </footer>
  );
};

export default Footer;

