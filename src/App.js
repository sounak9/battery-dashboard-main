import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

const App = () => {
  // State to manage the active view: 'dashboard', 'data-logs', or 'sensors'
  const [activeView, setActiveView] = useState('dashboard');

  // Refs for each chart canvas element
  const voltageChartRef = useRef(null);
  const currentChartRef = useRef(null);
  const socChartRef = useRef(null);
  const tempChartRef = useRef(null);
  const alertChartRef = useRef(null);

  // Define chart data and configurations
  const chartDataAndConfigs = {
    voltage: {
      data: {
        labels: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
        datasets: [{
          label: 'Voltage (V)',
          data: [12.3, 12.2, 12.1, 12.0, 11.9, 11.8, 11.7],
          borderColor: '#10B981', // Healthy green
          backgroundColor: 'rgba(16, 185, 129, 0.2)', // Light green fill
          tension: 0.3, // Smooth curve
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#10B981',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#A0AEC0', font: { size: 12 } } }, title: { display: true, text: 'Real-Time Voltage Over Time', color: '#CBD5E0', font: { size: 16 } } },
        scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } } }, y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } }, beginAtZero: false } }
      }
    },
    current: {
      data: {
        labels: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
        datasets: [{
          label: 'Current (A)',
          data: [1.5, 1.4, 1.6, 1.5, 1.3, 1.4, 1.5],
          borderColor: '#60A5FA', // Blue color
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          tension: 0.3, fill: true, pointRadius: 4, pointBackgroundColor: '#60A5FA', pointBorderColor: '#fff', pointHoverRadius: 6, pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#60A5FA',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#A0AEC0', font: { size: 12 } } }, title: { display: true, text: 'Real-Time Current Over Time', color: '#CBD5E0', font: { size: 16 } } },
        scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } } }, y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } }, beginAtZero: true } }
      }
    },
    soc: {
      data: {
        labels: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
        datasets: [{
          label: 'SOC (%)',
          data: [90, 88, 85, 83, 80, 78, 75],
          borderColor: '#FBBF24', // Amber color
          backgroundColor: 'rgba(251, 191, 36, 0.2)',
          tension: 0.3, fill: true, pointRadius: 4, pointBackgroundColor: '#FBBF24', pointBorderColor: '#fff', pointHoverRadius: 6, pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#FBBF24',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#A0AEC0', font: { size: 12 } } }, title: { display: true, text: 'State of Charge (SOC) Over Time', color: '#CBD5E0', font: { size: 16 } } },
        scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } } }, y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } }, beginAtZero: true, max: 100 } }
      }
    },
    temp: {
      data: {
        labels: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
        datasets: [{
          label: 'Temperature (°C)',
          data: [25, 26, 25.5, 27, 26.5, 28, 27.5],
          borderColor: '#F87171', // Red color
          backgroundColor: 'rgba(248, 113, 113, 0.2)',
          tension: 0.3, fill: true, pointRadius: 4, pointBackgroundColor: '#F87171', pointBorderColor: '#fff', pointHoverRadius: 6, pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#F87171',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#A0AEC0', font: { size: 12 } } }, title: { display: true, text: 'Real-Time Temperature Over Time', color: '#CBD5E0', font: { size: 16 } } },
        scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } } }, y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } }, beginAtZero: false } }
      }
    },
    alert: {
      data: {
        labels: ['Battery A001', 'Battery B002', 'Battery C003', 'Battery D004', 'Battery E005', 'Battery F006'],
        datasets: [{
          label: 'Number of Alerts',
          data: [0, 2, 0, 0, 1, 0], // Sample data: Battery B002 has 2 alerts, Battery E005 has 1 alert
          backgroundColor: [
            'rgba(16, 185, 129, 0.6)', // Green for A001 (no alerts in sample)
            '#DC2626', // Red for B002 (alerts)
            'rgba(16, 185, 129, 0.6)', // Green for C003
            'rgba(16, 185, 129, 0.6)', // Green for D004
            '#DC2626', // Red for E005 (alerts)
            'rgba(16, 185, 129, 0.6)'  // Green for F006
          ],
          borderColor: '#14234C', // Border color matching card background
          borderWidth: 1
        }]
      },
      options: {
        type: 'bar', // Using a bar chart for alert distribution
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: 'Alerts per Battery ID', color: '#CBD5E0', font: { size: 16 } } },
        scales: { x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } } }, y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#A0AEC0', font: { size: 12 } }, beginAtZero: true, precision: 0 } }
      }
    }
  };

  // Generic function to create/destroy Chart.js instances
  const createChart = (canvasRef, type, data, options) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      // Destroy existing chart instance if it exists to prevent re-rendering issues
      if (canvasRef.current.chart) {
        canvasRef.current.chart.destroy();
      }
      canvasRef.current.chart = new Chart(ctx, { type, data, options });
    }
  };

  // Effect to manage chart initialization based on the active view
  useEffect(() => {
    // Cleanup function to destroy all charts when the component unmounts or the effect re-runs
    return () => {
      if (voltageChartRef.current && voltageChartRef.current.chart) voltageChartRef.current.chart.destroy();
      if (currentChartRef.current && currentChartRef.current.chart) currentChartRef.current.chart.destroy();
      if (socChartRef.current && socChartRef.current.chart) socChartRef.current.chart.destroy();
      if (tempChartRef.current && tempChartRef.current.chart) tempChartRef.current.chart.destroy();
      if (alertChartRef.current && alertChartRef.current.chart) alertChartRef.current.chart.destroy();
    };
  }, []); // Run once on mount for initial cleanup setup

  // Effect to re-initialize charts when the activeView changes
  useEffect(() => {
    // Only initialize charts relevant to the 'dashboard' view
    if (activeView === 'dashboard') {
      createChart(voltageChartRef, 'line', chartDataAndConfigs.voltage.data, chartDataAndConfigs.voltage.options);
      createChart(currentChartRef, 'line', chartDataAndConfigs.current.data, chartDataAndConfigs.current.options);
      createChart(socChartRef, 'line', chartDataAndConfigs.soc.data, chartDataAndConfigs.soc.options);
      createChart(tempChartRef, 'line', chartDataAndConfigs.temp.data, chartDataAndConfigs.temp.options);
      createChart(alertChartRef, 'bar', chartDataAndConfigs.alert.data, chartDataAndConfigs.alert.options);
    }
    // For 'data-logs' and 'sensors' views, no charts are displayed in this specific setup,
    // so no chart initialization is needed here.
  }, [activeView]); // Re-run this effect when activeView changes

  // Function to handle view changes and update active sidebar item
  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  return (
    <div className="bg-dark-blue-main min-h-screen flex flex-col" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Custom scrollbar styles embedded for self-containment */}
      <style>{`
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1A2B5B;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #3A4B7B;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #5A6B9B;
        }
        .sidebar-item-active {
            color: #10B981 !important; /* Green color for active icon/text */
            font-weight: bold;
            transform: scale(1.1);
        }
        /* Previous dark blue colors */
        .bg-dark-blue-main {
            background-color: #1E3A8A; /* Slightly different dark blue for main background */
        }
        .bg-dark-blue-card {
            background-color: #1A2B5B; /* Previous main background color for cards */
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="bg-dark-blue-card h-16 flex items-center justify-between px-6 shadow-xl rounded-b-xl">
        <div className="flex flex-col items-start">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">Battery Monitoring Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <i className="fas fa-user-circle text-gray-300 text-3xl cursor-pointer hover:text-white transition-all duration-300 transform hover:scale-110"></i>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar for Navigation */}
        <aside className="w-20 bg-dark-blue-card shadow-xl p-4 flex flex-col items-center space-y-8 py-8 rounded-r-xl">
          <div
            id="sidebar-dashboard"
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 transform hover:scale-105 ${activeView === 'dashboard' ? 'sidebar-item-active' : 'text-gray-400'}`}
            onClick={() => handleViewChange('dashboard')}
          >
            <i className="fas fa-th-large text-xl mb-2"></i>
            <span className="text-xs font-medium">Dashboard</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
            <i className="fas fa-cog text-xl mb-2"></i>
            <span className="text-xs font-medium">Settings</span>
          </div>
          <div
            id="sidebar-data-logs"
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 transform hover:scale-105 ${activeView === 'data-logs' ? 'sidebar-item-active' : 'text-gray-400'}`}
            onClick={() => handleViewChange('data-logs')}
          >
            <i className="fas fa-clipboard-list text-xl mb-2"></i>
            <span className="text-xs font-medium">Data Logs</span>
          </div>
          <div
            id="sidebar-sensors"
            className={`flex flex-col items-center cursor-pointer transition-colors duration-200 transform hover:scale-105 ${activeView === 'sensors' ? 'sidebar-item-active' : 'text-gray-400'}`}
            onClick={() => handleViewChange('sensors')}
          >
            <i className="fas fa-microchip text-xl mb-2"></i>
            <span className="text-xs font-medium">Sensors</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 mt-auto">
            <i className="fas fa-sign-out-alt text-xl mb-2"></i>
            <span className="text-xs font-medium">Logout</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col h-full">

          {/* Dashboard View Content */}
          {activeView === 'dashboard' && (
            <div id="dashboard-view" className="grid grid-rows-[auto,auto,1fr] gap-8 h-full">
              {/* Four prominent cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Temperature In Card */}
                <div className="bg-dark-blue-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-400 text-sm mb-2">Temperature In</p>
                  <p className="text-5xl font-bold">25°C</p>
                  <p className="text-gray-400 text-sm mt-2">Indoor Temperature</p>
                </div>

                {/* Current Card */}
                <div className="bg-dark-blue-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-400 text-sm mb-2">Current</p>
                  <p className="text-5xl font-bold">1.5A</p>
                  <p className="text-gray-400 text-sm mt-2">Real-time Current</p>
                </div>

                {/* Voltage Card */}
                <div className="bg-dark-blue-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-400 text-sm mb-2">Voltage</p>
                  <p className="text-5xl font-bold">12.8V</p>
                  <p className="text-gray-400 text-sm mt-2">Real-time Voltage</p>
                </div>

                {/* SOC (State of Charge) Card */}
                <div className="bg-dark-blue-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-white transform hover:scale-105 transition-transform duration-300">
                  <p className="text-gray-400 text-sm mb-2">SOC (State of Charge)</p>
                  <p className="text-5xl font-bold">90%</p>
                  <p className="text-gray-400 text-sm mt-2">State of Charge</p>
                </div>
              </section>

              {/* Graphs for Voltage, Current, SOC, Temperature */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Real-Time Voltage Graph Panel */}
                <section className="bg-dark-blue-card rounded-xl shadow-lg p-6 flex flex-col h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">Voltage Over Time</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <canvas ref={voltageChartRef}></canvas>
                  </div>
                </section>

                {/* Real-Time Current Graph Panel */}
                <section className="bg-dark-blue-card rounded-xl shadow-lg p-6 flex flex-col h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">Current Over Time</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <canvas ref={currentChartRef}></canvas>
                  </div>
                </section>

                {/* Real-Time SOC Graph Panel */}
                <section className="bg-dark-blue-card rounded-xl shadow-lg p-6 flex flex-col h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">State of Charge (SOC) Over Time</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <canvas ref={socChartRef}></canvas>
                  </div>
                </section>

                {/* Real-Time Temperature Graph Panel */}
                <section className="bg-dark-blue-card rounded-xl shadow-lg p-6 flex flex-col h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">Temperature Over Time</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <canvas ref={tempChartRef}></canvas>
                  </div>
                </section>
              </div>

              {/* Alert System Graph Section and Notification Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* This div was incorrectly closed by a section tag, changed to div */}
                <div className="bg-dark-blue-card rounded-xl shadow-lg p-6 flex flex-col h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">Alerts per Battery ID</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <canvas ref={alertChartRef}></canvas>
                  </div>
                </div> {/* Corrected closing tag */}

                <div className="bg-dark-blue-card p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center h-full">
                  <h2 className="text-white text-lg font-semibold mb-4">Active Alerts</h2>
                  <div className="bg-[#DC2626] bg-opacity-20 border-2 border-[#DC2626] rounded-xl p-6 flex flex-col items-center space-y-4 w-full max-w-md">
                    <i className="fas fa-exclamation-circle text-6xl text-[#DC2626]"></i>
                    <p className="text-white text-2xl font-bold">CRITICAL ALERT!</p>
                    <p className="text-gray-200 text-lg">Battery B002: Overheating detected. Temperature: 45.2°C</p>
                    <button className="bg-[#DC2626] text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105">Acknowledge Alert</button>
                  </div>
                  <p className="text-gray-400 text-sm mt-4">No other critical alerts at this time.</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Logs View Content */}
          {activeView === 'data-logs' && (
            <div id="data-logs-view">
              <section className="bg-dark-blue-card rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-white text-lg font-semibold mb-4">Data Logs</h2>
                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-dark-blue-main">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Voltage</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Temp</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Current</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">10:00 AM</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">12.3V</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">36.1°C</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">0.9A</td></tr>
                      <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">10:05 AM</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">11.8V</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">45.2°C</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">1.2A</td></tr>
                      <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">10:10 AM</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">12.5V</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">35.5°C</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">0.8A</td></tr>
                      <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">10:15 AM</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">12.4V</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">37.0°C</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">1.0A</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Sensors View Content */}
          {activeView === 'sensors' && (
            <div id="sensors-view">
              <section className="bg-dark-blue-card rounded-xl shadow-lg p-6">
                <h2 className="text-white text-lg font-semibold mb-6">Sensors Overview</h2>
                <div className="space-y-6">
                  {/* Battery A001 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery A001 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Sensor Item - Temperature */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">25.3°C</span>
                        <p className="text-xs text-gray-400 mt-1">Optimal operating temperature.</p>
                      </div>
                      {/* Sensor Item - Voltage */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">12.8V</span>
                        <p className="text-xs text-gray-400 mt-1">Stable output voltage.</p>
                      </div>
                      {/* Sensor Item - Current */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">1.5A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      {/* Sensor Item - SOC */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-half text-[#34D399] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">90%</span>
                        <p className="text-xs text-gray-400 mt-1">High state of charge.</p>
                      </div>
                    </div>
                  </div>

                  {/* Battery B002 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery B002 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Sensor Item - Temperature */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#DC2626] font-semibold">45.2°C</span>
                        <p className="text-xs text-gray-400 mt-1 text-[#DC2626]">Overheating detected!</p>
                      </div>
                      {/* Sensor Item - Voltage */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#DC2626] font-semibold">11.8V</span>
                        <p className="text-xs text-gray-400 mt-1 text-[#DC2626]">Voltage below threshold.</p>
                      </div>
                      {/* Sensor Item - Current */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">1.2A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      {/* Sensor Item - SOC */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-empty text-[#DC2626] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#DC2626] font-semibold">20%</span>
                        <p className="text-xs text-gray-400 mt-1 text-[#DC2626]">Battery charge critical.</p>
                      </div>
                    </div>
                  </div>

                  {/* Battery C003 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery C003 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">28.0°C</span>
                        <p className="text-xs text-gray-400 mt-1">Normal operating temperature.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">12.7V</span>
                        <p className="text-xs text-gray-400 mt-1">Stable output voltage.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">1.0A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-half text-[#34D399] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">85%</span>
                        <p className="text-xs text-gray-400 mt-1">Healthy state of charge.</p>
                      </div>
                    </div>
                  </div>

                  {/* Battery D004 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery D004 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">26.5°C</span>
                        <p className="text-xs text-gray-400 mt-1">Normal operating temperature.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">12.6V</span>
                        <p className="text-xs text-gray-400 mt-1">Stable output voltage.</p>
                      </div>
                      {/* Current Sensor */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">0.9A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      {/* SOC Sensor */}
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-half text-[#34D399] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">92%</span>
                        <p className="text-xs text-gray-400 mt-1">High state of charge.</p>
                      </div>
                    </div>
                  </div>

                  {/* Battery E005 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery E005 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">30.1°C</span>
                        <p className="text-xs text-gray-400 mt-1">Normal operating temperature.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#DC2626] font-semibold">10.5V</span>
                        <p className="text-xs text-gray-400 mt-1 text-[#DC2626]">Voltage critically low!</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">1.8A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-empty text-[#DC2626] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#DC2626] font-semibold">5%</span>
                        <p className="text-xs text-gray-400 mt-1 text-[#DC2626]">Battery charge empty!</p>
                      </div>
                    </div>
                  </div>

                  {/* Battery F006 Sensors */}
                  <div className="bg-dark-blue-main p-4 rounded-lg shadow-md">
                    <h3 className="text-white text-base font-semibold mb-3">Battery F006 Sensors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-thermometer-half text-[#F87171] text-lg"></i>
                          <span className="font-medium">Temperature</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">27.5°C</span>
                        <p className="text-xs text-gray-400 mt-1">Normal operating temperature.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-bolt text-[#FBBF24] text-lg"></i>
                          <span className="font-medium">Voltage</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">12.9V</span>
                        <p className="text-xs text-gray-400 mt-1">Stable output voltage.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-charging-station text-[#60A5FA] text-lg"></i>
                          <span className="font-medium">Current</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">1.1A</span>
                        <p className="text-xs text-gray-400 mt-1">Normal current draw.</p>
                      </div>
                      <div className="flex flex-col items-start text-gray-300 text-sm p-2 rounded-lg">
                        <div className="flex items-center justify-between w-full">
                          <i className="fas fa-battery-half text-[#34D399] text-lg"></i>
                          <span className="font-medium">SOC</span>
                        </div>
                        <span className="text-[#10B981] font-semibold">95%</span>
                        <p className="text-xs text-gray-400 mt-1">High state of charge.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;