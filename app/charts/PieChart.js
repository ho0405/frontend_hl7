'use client';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
/**
 * LogoutChart is a component that renders a line chart representing the average stay time
 * for users during their logged-in sessions.
 *
 * It takes logoutData which includes logout times and the time difference of user sessions,
 * calculates the average stay time per date, and displays this as a line chart.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {Object[]} props.logoutData - An array of objects containing logoutTime and timeDifferenceMinutes.
 * @param {boolean} props.isDarkMode - A boolean flag indicating if the chart should use a dark mode theme.
 * @returns {React.ReactElement} A Line chart component from react-chartjs-2.
 */

const PieChart = ({ data, isDarkMode }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Download Distribution',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  

  useEffect(() => {
    if (data && data.length > 0) { 
      const downloadCountsByTime = {
        'Morning': 0,
        'Afternoon': 0,
        'Evening': 0,
      };

      data.forEach(activity => {
        const hour = new Date(activity.timestamp).getHours();
        if (hour >= 5 && hour < 12) {
          downloadCountsByTime['Morning'] += 1;
        } else if (hour >= 12 && hour < 18) {
          downloadCountsByTime['Afternoon'] += 1;
        } else {
          downloadCountsByTime['Evening'] += 1;
        }
      });

      const labels = Object.keys(downloadCountsByTime);
      const counts = labels.map(label => downloadCountsByTime[label]);
      const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Number of Downloads',
            data: counts,
            backgroundColor: backgroundColors,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="chart-container max-w-lg" style={{ height: '400px', width: '100%' }}>
      <p>Downloads by Time of Day</p>
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              color: '#333', 
              formatter: (value, context) => { 
                return ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + '%';
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;