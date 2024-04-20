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
import './admin.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, TimeSeriesScale);

/**
 * The AdminDashboard component serves as the main page for administrators, showing different
 * metrics and charts based on user login/logout and activity data. It fetches historical data
 * from Firestore and renders it in various chart formats for analysis.
 *
 * @component
 * @returns {React.ReactElement} The rendered component.
 */

const AdminDashboard = () => {
  const { logOut } = UserAuth();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [logoutHistory, setLogoutHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const defaultTextColor = 'text-black';

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const loginQuery = query(collection(db, 'logins'), orderBy('timestamp', 'desc'));
      const activityQuery = query(collection(db, 'activityHistory'), orderBy('timestamp', 'desc'));
      const logoutQuery = query(collection(db, 'logouts'), orderBy('logoutTime', 'desc'));
      
      const [loginSnapshot, activitySnapshot, logoutSnapshot] = await Promise.all([
        getDocs(loginQuery),
        getDocs(activityQuery),
        getDocs(logoutQuery),
      ]);

      setLoginHistory(loginSnapshot.docs.map(doc => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate() })));
      setActivityHistory(activitySnapshot.docs.map(doc => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate() })));
      setLogoutHistory(logoutSnapshot.docs.map(doc => ({ ...doc.data(), loginTime: doc.data().loginTime.toDate(), logoutTime: doc.data().logoutTime.toDate() })));
      
      setLoading(false);
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
  const averageStayTime = logoutHistory.reduce((acc, { timeDifferenceMinutes }) => acc + timeDifferenceMinutes, 0) / logoutHistory.length;
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black shadow-lg rounded-lg';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <nav className={`p-5 shadow-md rounded-lg mt-5 mx-5 ${cardClass}`}>
        <div className="flex justify-between items-center">
          <img src="images/logo.png" alt="Logo" className="h-12 w-28 mr-4" />
          <div className={`text-left text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>ADMIN</div>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <button onClick={handleSignOut} className="px-4 py-2 rounded-md bg-blue-500 text-white transition duration-300 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 border-2 border-transparent">
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className={`p-4 shadow-md mx-5 w-100 transparent-card ${cardClass}`}>
        <ul className="flex justify-center space-x-12">
          {['dashboard', 'loginHistory', 'logoutHistory', 'activityHistory', 'chart'].map(view => (
            <li key={view}>
              <button
                onClick={() => setDisplayContent(view)}
                className={`focus:outline-none hover:text-blue-500 focus:text-blue-500 ${
                  displayContent === view ? 'text-blue-500' : isDarkMode ? 'text-white' : 'text-black'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <div className="mx-auto px-5 min-h-screen flex justify-center items-center">Loading...</div>
      ) : (
        <div className="m-5 py-5">
          {displayContent === 'dashboard' && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                <div className="col-span-1 relative">
                  <img src="/images/login.png" alt="Login Icon" className="absolute z-10 w-20 h-20 m-2" />
                  <ChartCard title="Total Logins" count={loginHistory.length} isDarkMode={isDarkMode ? 'text-white' : defaultTextColor} />
                </div>
                <div className="col-span-1 relative">
                  <img src="/images/time.png" alt="Login Icon" className="absolute z-10 w-20 h-20 m-2" />
                  <ChartCard title="Average Stay Time" count={averageStayTime.toFixed(2)} isDarkMode={isDarkMode ? 'text-white' : defaultTextColor} />
                </div>
                <div className="col-span-1 relative">
                  <img src="/images/direct-download.png" alt="Login Icon" className="absolute z-10 w-20 h-20 m-2" />
                  <ChartCard title="Total Downloads" count={activityHistory.length} isDarkMode={isDarkMode ? 'text-white' : defaultTextColor} />
                </div>
                <div className="col-span-1">
                  <ChartContainer chart={<LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />} />
                </div>
                <div className="col-span-1">
                  <ChartContainer chart={<LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />} />
                </div>
                <div className="col-span-1">
                  <ChartContainer chart={<PieChart data={activityHistory} isDarkMode={isDarkMode} />} />
                </div>
              </div>
            </>
          )}
          {displayContent === 'loginHistory' && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <LoginHistory loginHistory={loginHistory} isDarkMode={isDarkMode} />
                <ChartContainer chart={<LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />} />
              </div>
            </>
          )}

          {displayContent === 'logoutHistory' && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <LogoutHistory logoutHistory={logoutHistory} isDarkMode={isDarkMode} />
                <ChartContainer chart={<LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />} />
              </div>
            </>
          )}

          {displayContent === 'activityHistory' && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <ActivityHistory activityHistory={activityHistory} isDarkMode={isDarkMode} />
                <ChartContainer chart={<PieChart data={activityHistory} isDarkMode={isDarkMode} />} />
              </div>
            </>
          )}

          {displayContent === 'chart' && ( 
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <ChartDisplay isDarkMode={isDarkMode} />
              </div>
            </>
          )}
        </div>
      )}
      <footer className="p-4 bg-blue-400 text-white py-4 mt-16">© Pureform & Pure kids Radiology 2024</footer>
    </div>
  );
};

const ChartCard = ({ title, count, isDarkMode }) => (
  <div className={`p-5 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center ${isDarkMode ? 'text-black' : 'text-white'}`}>
    <h2 className="text-lg font-bold text-center">{title}</h2>
    <p className="text-xl">{count}</p>
  </div>
);

const ChartContainer = ({ chart }) => (
  <div className="p-5 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center w-full">
    {chart}
  </div>
);

const LoginHistory = ({ loginHistory, isDarkMode }) => (
  <div className="w-full p-5 bg-white rounded-lg shadow-lg">
    <h2 className={`text-xl font-semibold mb-4 text-black`}>Login History</h2>
    <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-8 py-4 text-left text-black">User Email</th>
            <th className="px-8 py-4 text-left text-black">Login Time</th>
          </tr>
        </thead>
        <tbody>
          {loginHistory.map((item, index) => (
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="px-6 py-4 text-black">{item.email}</td>
              <td className="px-6 py-4 text-black">{item.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LogoutHistory = ({ logoutHistory, isDarkMode }) => (
  <div className="w-full p-5 bg-white rounded-lg shadow-lg">
    <h2 className={`text-xl font-semibold mb-4 text-black`}>Logout History</h2>
    <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-4 text-left text-black">Email</th>
            <th className="px-6 py-4 text-left text-black">Login Time</th>
            <th className="px-6 py-4 text-left text-black">Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {logoutHistory.map((item, index) => (
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="px-4 py-4 text-black">{item.email}</td>
              <td className="px-4 py-4 text-black">{item.loginTime.toLocaleString()}</td>
              <td className="px-4 py-4 text-black">{item.logoutTime.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ActivityHistory = ({ activityHistory, isDarkMode }) => (
  <div className="w-full p-5 bg-white rounded-lg shadow-lg">
    <h2 className={`text-xl font-semibold mb-4 text-black`}>Activity History</h2>
    <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-4 text-left text-black">User Email</th>
            <th className="px-4 py-4 text-left text-black">Activity Type</th>
            <th className="px-5 py-3 text-left text-black">File Name</th>
            <th className="px-4 py-3 text-left text-black">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activityHistory.map((activity, index) => (
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="px-4 py-3 text-black">{activity.userEmail}</td>
              <td className="pl-6 pr-10 py-3 text-black">{activity.activityType}</td>
              <td className="px-5 py-3 text-black">{activity.fileName}</td>
              <td className="px-4 py-3 text-black">{activity.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ChartDisplay = ({ isDarkMode }) => (
  <div className="w-full p-5 bg-white rounded-lg shadow-lg">
    <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Converted Chart</h2>
    {/* Chart implementation here */}
    <Bar
      data={{
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'Test Data',
          data: [6, 18, 36, 69, 0],
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
        }]
      }}
      options={{
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }}
    />
  </div>
);

export default AdminDashboard;
