'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // corrected import path
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { UserAuth } from '../context/AuthContext';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale } from 'chart.js';
import 'chartjs-adapter-moment';
import Chart from 'chart.js/auto';
import LogoutChart from '../charts/LogoutChart';
import PieChart from '../charts/PieChart';
import LoginChart from '../charts/LoginChart';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale);

const AdminDashboard = () => {
  const { logOut } = UserAuth();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [logoutHistory, setLogoutHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState('dashboard');
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

  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <nav className={`p-4 shadow-md rounded-lg mt-4 mx-10 ${cardClass}`}>
        <div className="flex justify-between items-center">
          <img src="images/logo.png" alt="Logo" className="h-12 w-28 mr-4" />
          <div className="flex items-center space-x-4">
            <button onClick={handleSignOut} className="px-4 py-2 rounded-md bg-blue-500 text-white transition duration-300 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 border-2 border-transparent">
              Sign Out
            </button>
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>
      <div className={`p-4 shadow-md rounded-lg mx-10 mt-4 w-100 ${cardClass}`}>
        <ul className="flex justify-center space-x-6">
          <li>
            <button onClick={() => handleDisplay('dashboard')} className={`${displayContent === 'dashboard' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
              Dashboard
            </button>
          </li>
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
          <li>
            <button onClick={() => handleDisplay('pieChart')} className={`${displayContent === 'pieChart' ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-gray-800'} focus:outline-none`}>
              Pie Chart
            </button>
          </li>
        </ul>
      </div>

      <div className=" mx-auto px-4 min-h-screen flex justify-center items-center">

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className={`flex flex-wrap p-8 m-4 rounded-lg shadow-lg animate-fade-in ${cardClass}`}>
            <div>
              {displayContent === 'dashboard' && (
                <>
                  <div className="flex flex-wrap justify-center">
                    <div className="bg-white-500 text-black text-center py-2 px-4 rounded-lg font-bold text-lg">
                      Total Logins: {loginHistory.length}
                    </div>
                    <div className="bg-white-500 text-black text-center py-2 px-4 rounded-lg font-bold text-lg">
                      Total Downloads: {activityHistory.length}
                    </div>
                    {/* <div className="bg-white text-black text-center py-2 px-4 rounded-lg font-bold text-lg">
                      New Signups: {newSignupCount}
                    </div> */}
                    <div className="mr-4">
                      <LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />
                    </div>
                    <div className="mr-4">
                      <LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />
                    </div>
                    <div>
                      <PieChart data={activityHistory} isDarkMode={isDarkMode} />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="lg:w-1/2 lg:pr-4">
              {displayContent === 'loginHistory' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Login History</h2>  
                  <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
                    <table className="w-full border-collapse border border-gray-300">   
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-8 py-4 text-left">User Email</th>
                          <th className="px-8 py-4 text-left">Login Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginHistory.map((item, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'dark:bg-gray-700' : 'dark:bg-gray-800'} ${bgClass}`}>
                            <td className="border border-gray-300 px-8 py-6">{item.email}</td>
                            <td className="border border-gray-300 px-8 py-6">{item.timestamp.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:w-1/2 lg:pl-4">
              {displayContent === 'loginHistory' && (
                <LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />
              )}
            </div>
                  

            
            {displayContent === 'logoutHistory' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Logout History</h2>
                
                <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-8 py-4 text-left">Email</th>
                        <th className="px-8 py-4 text-left">Login Time</th>
                        <th className="px-8 py-4 text-left">Logout Time</th>
                        <th className="px-8 py-4 text-left">Duration (minutes)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logoutHistory.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className="border border-gray-300 px-8 py-6">{item.email}</td>
                          <td className="border border-gray-300 px-8 py-6">{item.loginTime.toLocaleString()}</td>
                          <td className="border border-gray-300 px-8 py-6">{item.logoutTime.toLocaleString()}</td>
                          <td className="border border-gray-300 px-8 py-6">{item.timeDifferenceMinutes.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {displayContent === 'logoutHistory' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Logout History</h2>
                  
                  <LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />
                </div>
              )}
              </div>
            )}



            {displayContent === 'activityHistory' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Activity History</h2>
                <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-8 py-4 text-left">User Email</th>
                        <th className="px-8 py-4 text-left">Activity Type</th>
                        <th className="px-8 py-4 text-left">File Name</th>
                        <th className="px-8 py-4 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityHistory.map((activity, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className="border border-gray-300 px-8 py-6">{activity.userEmail}</td>
                          <td className="border border-gray-300 px-8 py-6">{activity.activityType}</td>
                          <td className="border border-gray-300 px-8 py-6">{activity.fileName}</td>
                          <td className="border border-gray-300 px-8 py-6">{activity.timestamp.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          
            {displayContent === 'chart' && (
            <div className="chart-container max-w-lg" style={{ height: '400px', width: '100%' }}>
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
            
            {displayContent === 'pieChart' && (
              <PieChart data={activityHistory} isDarkMode={isDarkMode} />
            )}
          </div>
        )}
      </div>
      <footer className="p-4 bg-blue-400 text-white py-4 mt-16">© Pureform & Pure kids Radiology 2024</footer>
    </div>
  );
};

export default AdminDashboard;
          