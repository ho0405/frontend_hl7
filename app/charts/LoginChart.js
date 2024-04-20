'use client'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

/**
 * LoginChart is a component that renders a bar chart of login counts over time.
 * 
 * @component
 * @param {Object} props - The props for the component.
 * @param {Object[]} props.loginData - An array of login data objects which contain timestamps.
 * @param {boolean} props.isDarkMode - A flag indicating if the chart should use dark mode styling.
 * @returns {React.ReactElement} A bar chart visualizing the login counts by date.
 */
const LoginChart = ({ loginData, isDarkMode }) => {
  const [loginCountsByDate, setLoginCountsByDate] = useState({});

  useEffect(() => {
    const calculateLoginCounts = () => {
      const loginCounts = loginData.reduce((acc, { timestamp }) => {
        const date = timestamp.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      setLoginCountsByDate(loginCounts);
    };

    calculateLoginCounts();
  }, [loginData]);

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
      colors.push(randomColor);
    }
    return colors;
  };

  const randomColors = generateRandomColors(1);

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%' }}>
      <Bar
        data={{
          labels: Object.keys(loginCountsByDate),
          datasets: [{
            label: 'Login Counts',
            data: Object.values(loginCountsByDate),
            backgroundColor: randomColors[0],
          }],
        }}
        options={{
          animation: {
            duration: 1000, 
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: { unit: 'day' },
              grid: {
                display: false, 
              },
            },
            y: { 
              beginAtZero: true, 
              title: { display: true, text: 'Number of Logins' },
              grid: {
                display: false, 
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LoginChart;