"use client"
import React from 'react';
import Link from 'next/link';


const ContactCard = ({ isDarkMode }) => {
  const locationsData = [
    {
      name: "Calgary Southeast",
      address: "519 - 4916 130 Ave SE Calgary, AB T2Z 0G4",
      hours: "Monday-Friday: 8AM-4PM, Saturday: 9AM-1PM",
    },
    {
      name: "Calgary Central",
      address: "200 - 3916 Macleod Trail SE, Calgary, AB T2G 2R5",
      hours: "Monday-Friday: 8AM-4PM, Saturday: Closed",
    },
    {
      name: "Calgary Northwest",
      address: "350 - 600 Crowfoot Cres NW, Calgary, AB T3G 0B4",
      hours: "Monday-Friday: 8AM-4PM, Saturday: Closed",
    },
    {
      name: "Airdrie",
      address: "20 - 105 Main St N, Airdrie, AB T4B 0R3",
      hours: "Monday-Friday: 8AM-4PM, Saturday: 9AM-3PM",
    }
  ];
  

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const logoBgClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-200'; // Darker background for the logo in dark mode
  const textClass = isDarkMode ? 'text-white' : 'text-gray-700';
  const cardHeight = "h-70"; // Set a consistent height for all cards

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Contact Information Card */}
      <div className={`max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass} ${cardHeight}`}>
        <div className={`flex items-center justify-center p-2 ${logoBgClass} cursor-pointer`}>
          <h2 className={`font-bold text-lg ${textClass}`}>Contact Information</h2>
        </div>
        <div className={`flex flex-col items-center p-3 space-y-2 ${bgClass}`}>
          <p className={`${textClass} text-sm`}>Phone: 403-726-9729</p>
          <p className={`${textClass} text-sm`}>Email: Info@MyPureform.com</p>
        </div>
      </div>
      <br/>

      {/* Location Cards */}
      <div className="flex flex-wrap justify-between w-full mt-4">
        {locationsData.map((location, index) => (
          <div key={location.name} className={`max-w-xs w-full md:w-1/2 lg:w-1/4 p-2`}>
            <div className={`rounded-md overflow-hidden shadow-lg ${bgClass} ${cardHeight}`}>
              <Link href="https://mypureform.com/" passHref>
                <div className={`flex items-center justify-center p-2 ${logoBgClass} cursor-pointer`}>
                  <img className="h-12" src="/images/logo.png" alt="Company Logo" />
                </div>
              </Link>
              <div className="flex flex-col justify-between p-3 space-y-2">
                <div>
                  <div className={`font-bold text-lg mb-1 ${textClass}`}>{location.name}</div>
                  <p className={`${textClass} text-sm`}>Address: {location.address}</p>
                </div>
                <p className={`${textClass} text-sm`}><strong>Hours:</strong> <br />{location.hours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;
