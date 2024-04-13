"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const ContactCard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClassLeft = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const cardClassRight = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'; // Adjust this as needed

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Contact Information Card */}
      <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>
        <div className={`flex items-center justify-center p-2 bg-gray-200`}>
          <h2 className="font-bold text-lg">Contact Information</h2>
        </div>
        <div className={`flex flex-col items-center p-3 space-y-2 ${cardClassRight}`}>
          <p className="text-gray-700 text-sm">Phone: 403-726-9729</p>
          <p className="text-gray-700 text-sm">Email: Info@MyPureform.com</p>
        </div>
      </div>
<br></br>
      {/* Location Cards */}
      <div className="flex justify-between w-full mt-4">
        {/* First Card */}
        <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>
          <Link href="https://mypureform.com/" passHref>
            <div className="flex items-center justify-center p-2 bg-gray-200 cursor-pointer">
              <img className="h-12" src="/images/logo.png" alt="Company Logo" />
            </div>
          </Link>
          <div className="flex">
            <div className={`flex-1 ${cardClassLeft} px-3 py-2 space-y-2`}>
              <div className="font-bold text-lg mb-1">Calgary Southeast</div>
              <p className="text-gray-700 text-sm">Address: 519 - 4916 130 Ave SE Calgary, AB T2Z 0G4</p>
              <p className="text-gray-700 text-sm"><strong>Hours:</strong> 
              <br />Monday-Friday: 8AM-4PM, 
              <br />Saturday: 9AM-1PM</p>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>
          <Link href="https://mypureform.com/" passHref>
            <div className="flex items-center justify-center p-2 bg-gray-200 cursor-pointer">
              <img className="h-12" src="/images/logo.png" alt="Company Logo" />
            </div>
          </Link>
          <div className="flex">
            <div className={`flex-1 ${cardClassRight} px-3 py-2 space-y-2`}>
              <div className="font-bold text-lg mb-1">Calgary Central</div>
              <p className="text-gray-700 text-sm">Address: 200 - 3916 Macleod Trail SE, Calgary, AB T2G 2R5</p>
              <p className="text-gray-700 text-sm"><strong>Hours:</strong> 
              <br />Monday-Friday: 8AM-4PM <br />Saturday:Closed</p>
            </div>
          </div>
        </div>

        {/* Third Card */}
        <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>
          <Link href="https://mypureform.com/" passHref>
            <div className="flex items-center justify-center p-2 bg-gray-200 cursor-pointer">
              <img className="h-12" src="/images/logo.png" alt="Company Logo" />
            </div>
          </Link>
          <div className="flex">
            <div className={`flex-1 ${cardClassLeft} px-3 py-2 space-y-2`}>
              <div className="font-bold text-lg mb-1">Calgary Northwest</div>
              <p className="text-gray-700 text-sm">Address: 350 - 600 Crowfoot Cres NW, Calgary, AB T3G 0B4</p>
              <p className="text-gray-700 text-sm"><strong>Hours:</strong> <br />Monday-Friday: 8AM-4PM <br /> Saturday: Closed</p>
            </div>
          </div>
        </div>

        {/* Fourth Card */}
        <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass}`}>
          <Link href="https://mypureform.com/" passHref>
            <div className="flex items-center justify-center p-2 bg-gray-200 cursor-pointer">
              <img className="h-12" src="/images/logo.png" alt="Company Logo" />
            </div>
          </Link>
          <div className="flex">
            <div className={`flex-1 ${cardClassRight} px-3 py-2 space-y-2`}>
              <div className="font-bold text-lg mb-1">Airdrie</div>
              <p className="text-gray-700 text-sm">Address: 20 - 105 Main St N, Airdrie, AB T4B 0R3</p>
              <p className="text-gray-700 text-sm"><strong>Hours:</strong> <br />Monday-Friday: 8AM-4PM <br />Saturday: 9AM-3PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;