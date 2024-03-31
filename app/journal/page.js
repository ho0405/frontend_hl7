"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; 
import { Avatar, Progress } from "@material-tailwind/react";
import LiveChatbot from '../chatbot/page';
import ThemeSwitcher from '../components/ThemeSwitcher';

const HomePage = () => {
  const { user, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [startConvert, setStartConvert] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [showChatbot, setShowChatbot] = useState(false);
  const [loginTime, setLoginTime] = useState(null); // login time

  const router = useRouter();

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot); // Function to toggle chatbot visibility
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve,50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileError('');
    } else {
      setSelectedFile(null);
      setFileError('Please upload a PDF file.');
    }
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

  const handleDownloadConfirm = () => {
    setDownloadModalOpen(false);
    handleConvert();
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

      <div className="flex-grow p-10">
        <div className="flex justify-center items-start space-x-8">
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
              <div className="text-center text-black mb-8">
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

      <footer className="p-4 shadow-inner">
  {/* Footer content */}
  <LiveChatbot />
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