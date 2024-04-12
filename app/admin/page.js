'use client'
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, getDocs } from 'firebase/firestore'; 
// import { collection, query, orderBy, getDocs } from '@firebase/firestore'; 
import { db } from '../_utils/firebase'; 
import ThemeSwitcher from '../components/ThemeSwitcher';

const AdminDashboard = () => {
  const { logOut } = UserAuth();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [logoutHistory, setLogoutHistory] = useState([]); 
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [showMore, setShowMore] = useState(false); // State variable to track showing more items

  
  useEffect(() => {
    setLoading(true);
    const fetchHistory = async () => {
      const loginQuery = query(collection(db, 'logins'), orderBy('timestamp', 'desc'));
      getDocs(loginQuery).then(loginSnapshot => {
        const loginData = loginSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(), // Ensuring timestamp conversion for display
        }));
        setLoginHistory(loginData);
      }).catch(error => {
        console.error('Failed to fetch login history:', error);
      });

      const activityQuery = query(collection(db, 'activityHistory'), orderBy('timestamp', 'desc'));
      getDocs(activityQuery).then(activitySnapshot => {
        const activityData = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(), // Ensuring timestamp conversion for display
        }));
        setActivityHistory(activityData);
      }).catch(error => {
        console.error('Failed to fetch activity history:', error);
      }).finally(() => setLoading(false));
    };

    fetchHistory();
  }, []);

  useEffect(() => {
  const fetchLogoutHistory = async () => {
    try {
      const logoutHistoryQuery = query(collection(db, 'logins'), orderBy('timestamp', 'desc'));
      const logoutHistorySnapshot = await getDocs(logoutHistoryQuery);
      const logoutHistoryData = logoutHistorySnapshot.docs.map(doc => ({
        email: doc.data().email,
        logoutTime: doc.data().logoutTime, 
        timeDifferenceMinutes: doc.data().timeDifferenceMinutes
      }));
      console.log("Logout History Data:", logoutHistoryData);
      setLogoutHistory(logoutHistoryData);
    } catch (error) {
      console.error('Failed to fetch logout history:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchLogoutHistory();
}, []);

  
  const handleSignOut = async () => {
    try {
      await logOut(); 
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleDisplayLoginHistory = () => {
    setDisplayContent('loginHistory');
  };

  const handleDisplayLogoutHistory = () => { 
    setDisplayContent('logoutHistory');
  };

  const handleDisplayActivityHistory = () => {
    setDisplayContent('activityHistory');
  };
  
  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };

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
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-md bg-blue-500 text-white transition duration-300 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 border-2 border-transparent"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <nav className={`p-4 shadow-md rounded-lg mx-10 bg-gray-100 text-gray-800 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <ul className="flex">
            <li className="mr-6">
              <button
                className={`hover:text-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} ${
                  displayContent === 'loginHistory'
                    ? 'text-blue-500'
                    : 'text-gray-800'
                  } ${displayContent === 'loginHistory' ? 'selected' : ''}`}
                onClick={handleDisplayLoginHistory}
              >
                Login History
              </button>
            </li>
            <li className="mr-6">
              <button
                className={`hover:text-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}  ${
                  displayContent === 'logoutHistory'
                    ? 'text-blue-500'
                    : 'text-gray-800'
                  } ${displayContent === 'logoutHistory' ? 'selected' : ''}`}
                onClick={handleDisplayLogoutHistory}
              >
                Logout History
              </button>
            </li>
            <li>
              <button
                className={`hover:text-blue-500 focus:outline-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} ${
                  displayContent === 'activityHistory'
                    ? 'text-blue-500'
                    : 'text-gray-800'
                  } ${displayContent === 'activityHistory' ? 'selected' : ''}`}
                onClick={handleDisplayActivityHistory}
              >
                Activity History
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto px-4 flex-grow flex justify-center items-center">
        {loading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.584 0-6.623-1.517-8.83-3.709z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          displayContent === 'loginHistory' && (
            <div className={`w-1/2 max-w-lg p-8 m-4 rounded-lg shadow-lg animate-fade-in ${cardClass}`}>
              <h2 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Login History
              </h2>
              <ul>
              {loginHistory.slice(0, showMore ? loginHistory.length : 10).map((item, index) => (
              <li key={index} className="mb-2">
                {item.email} - {item.timestamp instanceof Date ? item.timestamp.toLocaleString() : new Date(item.timestamp.seconds * 1000).toLocaleString()}
              </li>
              ))}
              </ul>
              {loginHistory.length > 10 && (
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </button>
              )}
            </div>
          ) ||
          displayContent === 'logoutHistory' && (
            <div className={`w-full max-w-lg p-8 rounded-lg shadow-lg animate-fade-in ${cardClass}`}>
              <h2 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Logout History
              </h2>
              <ul>
              {logoutHistory.map((item, index) => ( 
  <li key={index} className="mb-2">
    {item.email} - {item.logoutTime ? item.logoutTime.toLocaleString() : 'Unknown'} - {item.timeDifferenceMinutes ? item.timeDifferenceMinutes.toFixed(2) : 'N/A'} minutes ago
  </li>
))}

              </ul>
            </div>
          ) ||
          displayContent === 'activityHistory' && (
            <div className={`w-full max-w-lg  p-8 rounded-lg shadow-lg animate-fade-in ${cardClass}`}>
              <h2 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Activity History
              </h2>
              <ul>
              {activityHistory.map(({ id, userEmail, activityType, fileName, timestamp }) => {
                
                const displayTimestamp = timestamp.seconds
                  ? new Date(timestamp.seconds * 1000).toLocaleString() 
                  : new Date(timestamp).toLocaleString();

                return (
                  <li key={id}>
                    {userEmail} - {activityType} - {fileName} - {displayTimestamp}
                  </li>
                );
              })}
              </ul>
              {showMore ? (
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={handleShowLess}
                >
                  Show Less
                </button>
              ) : (
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={handleShowMore}
                >
                  Show More
                </button>
              )}
            </div>
          )
        )}
      </div>
      <footer className="bg-blue-400 text-white py-4"></footer>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .selected {
          color: #3b82f6; 
          font-weight: bold; 
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
