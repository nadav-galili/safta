import "./App.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Ronit() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [savedTimes, setSavedTimes] = useState({ start: "", end: "" });

  // Load saved times from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("lockTimes");
    if (saved) {
      const parsedTimes = JSON.parse(saved);
      setSavedTimes(parsedTimes);
      setStartTime(parsedTimes.start);
      setEndTime(parsedTimes.end);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const times = { start: startTime, end: endTime };
    setSavedTimes(times);
    // Save to localStorage
    localStorage.setItem("lockTimes", JSON.stringify(times));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Link
        to="/"
        className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-blue-500 mb-8">
        Lock Time Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-2">
            Start Lock Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700 mb-2">
            End Lock Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Save Times
        </button>
      </form>

      {savedTimes.start && savedTimes.end && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Saved Times:
          </h3>
          <p className="text-green-700">Start: {savedTimes.start}</p>
          <p className="text-green-700">End: {savedTimes.end}</p>
        </div>
      )}
    </div>
  );
}

export default Ronit;
