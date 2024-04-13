"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; 
import { Avatar, Progress } from "@material-tailwind/react";
import ThemeSwitcher from '../components/ThemeSwitcher';
import { db, auth } from "../_utils/firebase"; // Adjust this path as needed
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Footer from '../penguinChatbot/footer';

const HomePage = () => {
  const { user, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [startConvert, setStartConvert] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [dragging, setDragging] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const storedLoginTime = sessionStorage.getItem('loginTime');
    if (storedLoginTime) {
      setLoginTime(new Date(storedLoginTime));
    }

    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve,50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  useEffect(() => {
    if (user && !loginTime) {
      const currentTime = new Date();
      sessionStorage.setItem('loginTime', currentTime.toISOString());
      setLoginTime(currentTime);
    }
  }, [user, loginTime]);

  const handleSignOut = async () => {
    try {
      const logoutTime = new Date();
      const timeDifference = loginTime ? (logoutTime - new Date(loginTime)) / (1000 * 60) : 0;

      await addDoc(collection(db, 'logouts'), {
        email: user?.email,
        loginTime: loginTime,
        logoutTime: logoutTime,
        timeDifferenceMinutes: timeDifference
      });

      sessionStorage.removeItem('loginTime');  // Clear session storage
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  

  const handleFileUpload = (event) => {
    const files = event.target.files || event.dataTransfer.files; // Handle files from input or drop
    const file = files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileError('');
    } else {
      setSelectedFile(null);
      setFileError('Please upload a PDF file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow drop
    if (!dragging) setDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileUpload(event); // Reuse the file upload handler
  };

  const handleConvert = () => {
    if (!selectedFile) {
      setFileError('Please select a file first.');
      return;
    }
    setStartConvert(true);
    setConversionProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Simulating conversion progress
    const conversionInterval = setInterval(() => {
      setConversionProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(conversionInterval);
        }
        return newProgress;
      });
    }, 50); // Adjust the interval for slower progression

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.hl7');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setDownloadModalOpen(false);
      setFileError('');
    })
    .catch(error => {
      console.error('Conversion failed:', error);
      setFileError('Conversion failed. Please try again.');
    })
    .finally(() => {
      setStartConvert(false);
    });
  };

  const handleDownloadConfirmation = () => {
    setDownloadModalOpen(true);
  };

  const handleDownloadConfirm = async () => {
    // Close the download modal
    setDownloadModalOpen(false);
  
    // Proceed with file conversion and download
    handleConvert();
  
    // Check if the user is logged in
    if (user) {
      try {
        // Record the activity history in Firestore with timestamp
        await addDoc(collection(db, "activityHistory"), {
          userEmail: user.email, // Or any other user identifier
          activityType: "Download",
          fileName: selectedFile ? selectedFile.name : "unknown", // Check if file is selected
          timestamp: serverTimestamp(), // Capture the server-side timestamp of the activity
        });
  
        console.log("Activity history recorded successfully.");
      } catch (error) {
        console.error("Error recording activity history:", error);
      }
    }
  };
  

  const handleDownloadCancel = () => {
    setDownloadModalOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!user || loading) {
    return null;
  }

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const buttonClass = isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-500 hover:bg-blue-600';
  const textColorClass = isDarkMode ? 'text-gray-300' : 'text-gray-900';
  
  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`} onDragOver={handleDragOver} onDrop={handleDrop}>
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
  
      <div className="flex-grow p-5">
        <div className="flex justify-center items-start space-x-5">
          {/* Profile section */}
          <div className={`w-1/5 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center ${cardClass}`} style={{ padding: "15vh 1vw" }}>
            <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant='rounded' size="md" />
            <div className="text-lg pt-4">Logged in with:</div>
            <div className="text-md font-semibold pb-4">{user.email}</div>
            <button onClick={handleSignOut} className="mt-auto bg-transparent border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition duration-300">
              Sign Out
            </button>
          </div>
          {/* Converting section */}
          <div className={`flex-1 p-10 rounded-lg shadow-lg ${cardClass}`} style={{ padding: "15vh 1vw" }}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-black mb-20">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Convert to HL7</h1>
                <div className="mt-8">
                  <label htmlFor="fileUpload" className={`text-lg bg-blue-300 border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-500 transition duration-300 cursor-pointer hover:border-blue-500 border-transparent ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Upload PDF File
                    <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} accept="application/pdf" />
                  </label>
                  {fileError && <p className={`text-red-500 mt-2 ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>{fileError}</p>}
                </div>
                {selectedFile && (
                  <div className="mt-4">
                    <p className={`text-1xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Selected file: {selectedFile.name}</p>
                    {!startConvert ? (
                      <button onClick={handleDownloadConfirmation} className="mt-4 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition duration-300">
                        Start Convert
                      </button>
                    ) : (
                      <div className="mt-4">
                        <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Converting... {conversionProgress}%</p>
                        <Progress color="blue" value={conversionProgress} style={{ width: '200px', height: '10px' }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow px-5">
  <div className={`py-12 px-4 sm:px-6 lg:px-8 ${cardClass} rounded-lg shadow-md`}>
    <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Feature 1: Automated PDF to HL7 Conversion */}
      <div className={`flex flex-col items-center text-center space-y-2 ${textColorClass}`}>
        <span className="text-3xl"><img src="images/convert.png" alt="convert" /></span>
        <h3 className="text-lg font-semibold">Automated PDF to HL7 Conversion</h3>
        <p>Transform your laboratory and hospital data workflows with our cutting-edge tool that converts PDF documents into HL7 format effortlessly and accurately.</p>
      </div>

      {/* Feature 2: Smart Data Extraction */}
      <div className={`flex flex-col items-center text-center space-y-2 ${textColorClass}`}>
        <span className="text-3xl"><img src="images/smart.png" alt="smart" /></span>
        <h3 className="text-lg font-semibold">Smart Data Extraction</h3>
        <p>Our advanced algorithms ensure precise extraction of checkboxes and patient information, turning manual entries into a thing of the past.</p>
      </div>

      {/* Feature 3: Seamless Integration */}
      <div className={`flex flex-col items-center text-center space-y-2 ${textColorClass}`}>
        <span className="text-3xl"><img src="images/link.png" alt="Link" /></span>
        <h3 className="text-lg font-semibold">Seamless Integration</h3>
        <p>Easily integrate our solution with existing hospital and laboratory information systems to streamline data processing and improve interoperability.</p>
      </div>

      {/* Feature 4: User-Friendly Platform */}
      <div className={`flex flex-col items-center text-center space-y-2 ${textColorClass}`}>
        <span className="text-3xl"><img src="images/trust.png" alt="trust" /></span>
        <h3 className="text-lg font-semibold">User-Friendly Platform</h3>
        <p>Our platform is designed with the user in mind, making it incredibly easy to use. Convert your files online without any need for software installation.</p>
      </div>
    </div>
  
  {/* Conversion API Section */}
  <div className="mt-10 text-center">
  <img src="images/api.png" alt="api" className="mx-auto d-block text-3xl" />
  <h3 className={`text-lg font-semibold ${textColorClass}`}>Conversion API</h3>
  <p className={`${textColorClass}`}>With passion to Developers</p>
  <div className="flex justify-center space-x-4 mt-4">
      <button className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 px-4 py-2 rounded ${buttonClass}`}>Documentation</button>
      <button className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 px-4 py-2 rounded ${buttonClass}`}>PHP Example</button>
      <button className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 px-4 py-2 rounded ${buttonClass}`}>Get an API Key</button>
    </div>
  </div>
  
  {/* Rating Section */}
  <div className="mt-10 text-center">
    <h3 className="text-lg font-semibold ${textColorClass}">Overall conversion quality rating</h3>
    <div className="flex justify-center items-center mt-2">
      <div className="text-3xl">⭐⭐⭐⭐⭐</div>
      <p className={`ml-2 ${textColorClass}`}>4.6 (92.3% Accuracy)</p>
    </div>
  </div>
</div>
</div>
      <footer className="p-5 shadow-inner">
        <Footer isDarkMode={isDarkMode} />
      </footer>
  
      {downloadModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`p-8 rounded-lg shadow-lg text-center ${cardClass}`}>
            <p className="text-lg font-semibold mb-4">Would you like to download the converted file?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleDownloadConfirm} className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition duration-300">
                Yes
              </button>
              <button onClick={handleDownloadCancel} className="bg-gray-500 text-white rounded py-2 px-4 hover:bg-gray-600 transition duration-300">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
