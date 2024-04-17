import React from 'react';
import Link from 'next/link';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ContactCard = ({ isDarkMode }) => {
  const locationsData = [
    {
      name: "Calgary Southeast",
      address: "519 - 4916 130 Ave SE Calgary, AB T2Z 0G4",
      hours: "Monday-Friday: 8AM-4PM, Saturday: 9AM-1PM",
      coordinates: { lat: 50.9356, lng: -113.9754 }
    },
    {
      name: "Calgary Central",
      address: "200 - 3916 Macleod Trail SE, Calgary, AB T2G 2R5",
      hours: "Monday-Friday: 8AM-4PM, Saturday: Closed",
      coordinates: { lat: 51.0171, lng: -114.0631 }
    },
    {
      name: "Calgary Northwest",
      address: "350 - 600 Crowfoot Cres NW, Calgary, AB T3G 0B4",
      hours: "Monday-Friday: 8AM-4PM, Saturday: Closed",
      coordinates: { lat: 51.1236, lng: -114.2060 }
    },
    {
      name: "Airdrie",
      address: "20 - 105 Main St N, Airdrie, AB T4B 0R3",
      hours: "Monday-Friday: 8AM-4PM, Saturday: 9AM-3PM",
      coordinates: { lat: 51.2917, lng: -114.0144 }
    }
  ];

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const logoBgClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-200'; // Darker background for the logo in dark mode
  const textClass = isDarkMode ? 'text-white' : 'text-gray-700';
  const cardHeight = "h-70"; // Set a consistent height for all cards

  return (
    <LoadScript googleMapsApiKey="AIzaSyAqfbnJATLTZzH8HwIoy-iAAWk2xKBB7aI">
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-xs w-full mx-auto rounded-md overflow-hidden shadow-lg ${bgClass} ${cardHeight}">
          <div className={`flex items-center justify-center p-2 ${logoBgClass} cursor-pointer`}>
            <h2 className={`font-bold text-lg ${textClass}`}>Contact Information</h2>
          </div>
          <div className={`flex flex-col items-center p-3 space-y-2 ${bgClass}`}>
            <p className={`${textClass} text-sm`}>Phone: 403-726-9729</p>
            <p className={`${textClass} text-sm`}>Email: Info@MyPureform.com</p>
          </div>
        </div>
        <br/>
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
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '200px' }}
                    center={location.coordinates}
                    zoom={15}
                  >
                    <Marker position={location.coordinates} />
                  </GoogleMap>
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
    </LoadScript>
  );
};

export default ContactCard;
