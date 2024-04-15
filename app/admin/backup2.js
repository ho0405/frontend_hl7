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

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-blue-300 to-purple-300 text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black shadow-lg rounded-lg';

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <nav className={`p-5 shadow-md rounded-lg mt-5 mx-5 ${cardClass}`}>
        <div className="flex justify-between items-center">
          <img src="images/logo.png" alt="Logo" className="h-12 w-28 mr-4" />
          <div className="flex items-center space-x-4">
            <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <button onClick={handleSignOut} className="px-4 py-2 rounded-md bg-blue-500 text-white transition duration-300 hover:bg-transparent hover:border-blue-500 hover:text-blue-500 border-2 border-transparent">
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className={`p-5 shadow-md rounded-lg mx-5 mt-5 w-100 ${cardClass}`}>
        <ul className="flex justify-center space-x-12">
          {['dashboard', 'loginHistory', 'logoutHistory', 'activityHistory', 'chart'].map(view => (
            <li key={view}>
              <button onClick={() => setDisplayContent(view)} className={`${displayContent === view ? 'text-blue-500' : 'text-gray-800'} focus:outline-none`}>
                {view.charAt(0).toUpperCase() + view.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <div className="mx-auto px-5 min-h-screen flex justify-center items-center">Loading...</div>
      ) : (
        <div className="px-5 py-5 flex flex-wrap justify-center items-start space-x-5">
          {displayContent === 'dashboard' && (
            <>
              <ChartCard title="Total Logins" count={loginHistory.length} />


              <ChartCard title="Total Downloads" count={activityHistory.length} />

              <ChartContainer chart={<LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />} />

              <ChartContainer chart={<LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />} />

              <ChartContainer chart={<PieChart data={activityHistory} isDarkMode={isDarkMode} />} />
            </>
          )}
          {displayContent === 'loginHistory' && (
  <>
    <LoginHistory loginHistory={loginHistory} bgClass={bgClass} />
    <ChartContainer chart={<LoginChart loginData={loginHistory} isDarkMode={isDarkMode} />} />
  </>
)}

{displayContent === 'logoutHistory' && (
  <>
    <LogoutHistory logoutHistory={logoutHistory} />
    <ChartContainer chart={<LogoutChart logoutData={logoutHistory} isDarkMode={isDarkMode} />} />
  </>
)}

{displayContent === 'activityHistory' && (
  <>
    <ActivityHistory activityHistory={activityHistory} />
    <ChartContainer chart={<PieChart data={activityHistory} isDarkMode={isDarkMode} />} />
  </>
)}

          {displayContent === 'chart' && <ChartDisplay />}

          
        </div>
      )}
      <footer className="p-4 bg-blue-400 text-white py-4 mt-16">© Pureform & Pure kids Radiology 2024</footer>
    </div>
  );
};

const ChartCard = ({ title, count }) => (
  <div className="p-5 m-2 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center md:w-1/4">
    <h2 className="text-lg font-bold text-center">{title}</h2>
    <p className="text-xl">{count}</p>
  </div>
);

const ChartContainer = ({ chart }) => (
  <div className="p-5 m-2 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center w-full md:w-1/2 chart-container">
    {chart}
  </div>
);

const LoginHistory = ({ loginHistory, bgClass }) => (
  <div className="w-full p-5 m-2 bg-white rounded-lg shadow-lg">
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
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} ${bgClass}`}>
              <td className="px-8 py-6">{item.email}</td>
              <td className="px-8 py-6">{item.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LogoutHistory = ({ logoutHistory }) => (
  <div className="w-full p-4 m-2 bg-white rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Logout History</h2>
    <div className="overflow-x-auto overflow-y-auto max-h-96 mt-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-8 py-4 text-left">Email</th>
            <th className="px-8 py-4 text-left">Login Time</th>
            <th className="px-8 py-4 text-left">Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {logoutHistory.map((item, index) => (
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="px-8 py-6">{item.email}</td>
              <td className="px-8 py-6">{item.loginTime.toLocaleString()}</td>
              <td className="px-8 py-6">{item.logoutTime.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ActivityHistory = ({ activityHistory }) => (
  <div className="w-full p-4 m-2 bg-white rounded-lg shadow-lg">
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
            <tr key={index} className={`border border-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
              <td className="px-8 py-6">{activity.userEmail}</td>
              <td className="px-8 py-6">{activity.activityType}</td>
              <td className="px-8 py-6">{activity.fileName}</td>
              <td className="px-8 py-6">{activity.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ChartDisplay = () => (
  <div className="w-full p-4 m-2 bg-white rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Converted Chart</h2>
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