import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import DataLogs from "./pages/DataLogs";
import Sensors from "./pages/Sensors";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1A2B5B] text-white">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-logs" element={<DataLogs />} />
              <Route path="/sensors" element={<Sensors />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
