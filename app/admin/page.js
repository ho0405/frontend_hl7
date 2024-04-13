'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // corrected import path
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { UserAuth } from '../context/AuthContext';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Image from 'next/image';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { logOut } = UserAuth();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [logoutHistory, setLogoutHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Conversions',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    setLoading(true);
    const fetchHistory = async () => {
      try {
        const loginQuery = query(collection(db, 'logins'), orderBy('timestamp', 'desc'));
        const activityQuery = query(collection(db, 'activityHistory'), orderBy('timestamp', 'desc'));
        const logoutQuery = query(collection(db, 'logouts'), orderBy('logoutTime', 'desc'));
        
        const [loginSnapshot, activitySnapshot, logoutSnapshot] = await Promise.all([
          getDocs(loginQuery),
          getDocs(activityQuery),
          getDocs(logoutQuery),
        ]);

        const loginData = loginSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        }));

        const activityData = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        }));

        const logoutData = logoutSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          loginTime: doc.data().loginTime.toDate(),
          logoutTime: doc.data().logoutTime.toDate(),
          timeDifferenceMinutes: doc.data().timeDifferenceMinutes,
        }));

        setLoginHistory(loginData);
        setActivityHistory(activityData);
        setLogoutHistory(logoutData);

        const conversionCounts = activityData.reduce((acc, { userEmail }) => {
          acc[userEmail] = (acc[userEmail] || 0) + 1;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(conversionCounts),
          datasets: [{
            label: 'Conversions',
            data: Object.values(conversionCounts),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }]
        });
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleDisplay = type => setDisplayContent(type);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <nav className={`p-4 shadow-md rounded-lg mt-4 mx-10 ${cardClass}`}>
        <div className="flex justify-between items-center">
        <Image src="/images/logo.png" alt="Logo" width={28} height={12} className="mr-4" />

          <div className="flex items-center space-x-4">
            <button onClick={handleSignOut} className="px-4 py-2 rounded-md bg-blue-500 text-white transition duration-300 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 border-2 border-transparent">
              Sign Out
            </button>
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>
      <div className={`p-4 shadow-md rounded-lg mx-10 mt-4 ${cardClass}`}>
  <ul className="flex justify-center space-x-6">
    <li>
      <button onClick={() => handleDisplay('loginHistory')} className={`${displayContent === 'loginHistory' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
        Login History
      </button>
    </li>
    <li>
      <button onClick={() => handleDisplay('logoutHistory')} className={`${displayContent === 'logoutHistory' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
        Logout History
      </button>
    </li>
    <li>
      <button onClick={() => handleDisplay('activityHistory')} className={`${displayContent === 'activityHistory' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
        Activity History
      </button>
    </li>
    <li>
      <button onClick={() => handleDisplay('chart')} className={`${displayContent === 'chart' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
        Conversion Chart
      </button>
    </li>
  </ul>
</div>

      <div className="container mx-auto px-4 flex-grow flex justify-center items-center">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className={`w-full max-w-lg p-8 mt-16 rounded-lg shadow-lg animate-fade-in ${cardClass}`}>
            {displayContent === 'loginHistory' && loginHistory.map((item, index) => (
              <div key={index}>{item.email} - {item.timestamp.toLocaleString()}</div>
            ))}
            {displayContent === 'logoutHistory' && logoutHistory.map((item, index) => (
              <div key={index}>{item.email} - {item.loginTime.toLocaleString()} - {item.logoutTime.toLocaleString()} - {item.timeDifferenceMinutes.toFixed(2)} minutes</div>
            ))}
            {displayContent === 'activityHistory' && activityHistory.map(({ id, userEmail, activityType, fileName, timestamp }, index) => (
              <div key={index}>{userEmail} - {activityType} - {fileName} - {timestamp.toLocaleString()}</div>
            ))}
            {displayContent === 'chart' && (
  <div className="chart-container" style={{ height: '400px', width: '100%' }}>
    <Bar
      data={{
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          backgroundColor: isDarkMode ? 'rgba(255, 255,0, 1)' : 'rgba(54, 162, 235,12 )',
        }],
      }}
      options={{ maintainAspectRatio: false }}
    />
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="p-4 bg-blue-400 text-white py-4 mt-16">© Pureform & Pure kids Radiology 2024</footer>
    </div>
  );
};

export default AdminDashboard;
