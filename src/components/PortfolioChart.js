// src/components/PortfolioChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock data to simulate portfolio history.
// TODO: Replace this with actual data from your API when available.
const generateMockHistory = (currentValue) => {
  const data = [];
  let value = currentValue * (Math.random() * 0.2 + 0.9); // Start from a value around the current one
  for (let i = 30; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value *= (1 + (Math.random() - 0.48) / 50); // Small daily fluctuation
    data.push({
      date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD
      value: Math.round(value),
    });
  }
  data.push({ date: new Date().toLocaleDateString('en-CA'), value: currentValue });
  return data;
};


const PortfolioChart = ({ portfolioData }) => {
  // If no portfolio data, don't render the chart
  if (!portfolioData || !portfolioData.portfolioValue) {
    return null;
  }

  // NOTE: This uses MOCK data. You should replace `mockHistory` with real API data.
  // The API should return an array like: [{ date: '2023-10-26', value: 500000 }, ...]
  const mockHistory = generateMockHistory(portfolioData.portfolioValue);
  const labels = mockHistory.map(item => item.date);
  const dataPoints = mockHistory.map(item => item.value);

  const data = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value (₹)',
        data: dataPoints,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 1,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Portfolio Performance (Last 30 Days)',
        font: { size: 16, weight: '500' },
        color: '#2c3e50',
        padding: { bottom: 20 }
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `₹${(value / 100000).toFixed(1)}L`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default PortfolioChart;