import "./App.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ronit from "./Ronit";

function HomePage() {
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [lockTimes, setLockTimes] = useState({ start: "22:00", end: "07:00" });

  // Load lock times from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("lockTimes");
    if (saved) {
      const parsedTimes = JSON.parse(saved);
      setLockTimes(parsedTimes);
    }
  }, []);

  const isUnavailableTime = () => {
    const currentTime = dayjs();
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    const [startHour, startMinute] = lockTimes.start.split(":").map(Number);
    const [endHour, endMinute] = lockTimes.end.split(":").map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    // Handle case where end time is next day (e.g., 22:00 to 07:00)
    if (endTime < startTime) {
      return currentTimeMinutes >= startTime || currentTimeMinutes < endTime;
    } else {
      return currentTimeMinutes >= startTime && currentTimeMinutes < endTime;
    }
  };

  const handleButtonClick = () => {
    // Reload lock times from localStorage to get latest values
    const saved = localStorage.getItem("lockTimes");
    if (saved) {
      const parsedTimes = JSON.parse(saved);
      setLockTimes(parsedTimes);
    }

    if (isUnavailableTime()) {
      setShowUnavailable(true);
    } else {
      // Make the call
      window.location.href = "tel:0528842706";
    }
  };

  useEffect(() => {
    if (showUnavailable) {
      const timer = setTimeout(() => {
        setShowUnavailable(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showUnavailable]);

  if (showUnavailable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full h-70 w-70 text-4xl font-bold transition-colors"
          onClick={handleButtonClick}>
          לחייג לרונית
        </button>
        <p className="text-2xl text-red-500 mt-4">
          אין קליטה, אנא נסי מאוחר יותר{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full h-70 w-70 text-4xl font-bold transition-colors"
        onClick={handleButtonClick}>
        לחייג לרונית
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ronit" element={<Ronit />} />
      </Routes>
    </Router>
  );
}

export default App;
