'use client'
import React, { useState } from 'react';
import Link from 'next/link';

const ContactCard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
    };
    
    const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  return (
    <div className={`max-w-sm w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>

      <Link href="https://mypureform.com/" passHref>
        <div className="flex items-center justify-center p-4 bg-gray-200 cursor-pointer">
            <img className="h-16" src="/images/logo.png" alt="Company Logo" />
        </div>
      </Link>
      <div className={`px-6 py-4 ${cardClass}`}>
        <div className="font-bold text-xl mb-2">PureForm Radiology</div>
        <p className="text-gray-700 text-base mb-2">1234 Street Address, City, Country</p>
        <p className="text-gray-700 text-base mb-2">Phone: +403-726-9729</p>
        <p className="text-gray-700 text-base mb-2">Email: info@example.com</p>
        <div className="flex justify-center space-x-6 my-4">
          <Link href="#" passHref>
            <svg className="h-6 w-6 text-blue-500 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm-1 17.93c-3.95-.19-7-4.05-7-8.93s3.05-8.74 7-8.93V7h-2v2.07c-2.98.15-5.29 2.59-5.29 5.43s2.31 5.29 5.29 5.43V17h2v-1.07z"/>
            </svg>
          </Link>
          <Link href="#" passHref>
            <svg className="h-6 w-6 text-blue-500 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.46 2.1C22.13 2.04 21.73 2 21.33 2H2.67C2.27 2 1.87 2.04 1.54 2.1 1.2 2.17.93 2.36.76 2.65c-.17.3-.24.68-.18 1.05l1.3 7.73 4.3 2.3c.27.15.58.23.88.23.28 0 .56-.08.82-.23l4.53-2.43L12 15l1.44.77 4.53 2.43c.26.15.54.23.82.23.3 0 .61-.08.88-.23l4.3-2.3 1.3-7.73c.06-.37 0-.75-.18-1.05-.16-.29-.43-.49-.77-.56zM20.5 4l-1.11 6.64-4.71 2.52-4.74-2.52L3.5 4h17zm-9.87 7.76L12 13l1.37-1.24 2.63 1.41-4 2.15-4-2.15 2.63-1.41z"/>
            </svg>
          </Link>
          <Link href="#" passHref>
            <img src="/path/to/your/image.png" className="h-6 w-6 text-blue-500 hover:text-blue-700" alt="Icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
