'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const LogoutChart = ({ logoutData, isDarkMode }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Average Stay Time',
        data: [],
        borderColor: isDarkMode ? 'rgba(255, 99, 132, 0.7)' : 'rgba(255, 99, 132, 0.7)', 
        borderWidth: 2,
        fill: false,
        lineTension: 0.8,
        pointStyle: 'circle', 
        pointRadius: 5, 
      },
    ],
  });

  useEffect(() => {
    const logoutDataByDate = {};
    logoutData.forEach(({ logoutTime, timeDifferenceMinutes }) => {
      const logoutDate = logoutTime.toLocaleDateString();
      if (!logoutDataByDate[logoutDate]) {
        logoutDataByDate[logoutDate] = [];
      }
      logoutDataByDate[logoutDate].push(timeDifferenceMinutes);
    });

    const averageStayTimeByDate = {};
    for (const date in logoutDataByDate) {
      const totalStayTime = logoutDataByDate[date].reduce((acc, time) => acc + time, 0);
      const averageStayTime = totalStayTime / logoutDataByDate[date].length;
      averageStayTimeByDate[date] = averageStayTime.toFixed(2);
    }

    setChartData({
      labels: Object.keys(averageStayTimeByDate),
      datasets: [
        {
          ...chartData.datasets[0],
          data: Object.values(averageStayTimeByDate),
        },
      ],
    });
  }, [logoutData, isDarkMode]);

  return (
    <div className="chart-container max-w-lg" style={{ height: '400px', width: '100%' }}>
      <Line
        data={chartData}
        options={{
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } }, 
            y: { grid: { display: false } }, 
          },
          plugins: {
            legend: { display: false }, 
            tooltip: {
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
              titleColor: isDarkMode ? '#fff' : '#000', 
              bodyColor: isDarkMode ? '#fff' : '#000', 
            },
          },
        }}
      />
    </div>
  );
};

export default LogoutChart;