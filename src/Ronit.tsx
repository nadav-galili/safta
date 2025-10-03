import "./App.css";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

function Ronit() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [savedTimes, setSavedTimes] = useState({ start: "", end: "" });
  const [callLogs, setCallLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Load saved times and logs from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("lockTimes");
    if (saved) {
      const parsedTimes = JSON.parse(saved);
      setSavedTimes(parsedTimes);
      setStartTime(parsedTimes.start);
      setEndTime(parsedTimes.end);
    }

    const logs = localStorage.getItem("callLogs");
    if (logs) {
      const parsedLogs = JSON.parse(logs);
      // Sort logs to show the latest first
      parsedLogs.sort(
        (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime()
      );
      setCallLogs(parsedLogs);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    const times = { start: startTime, end: endTime };
    setSavedTimes(times);
    // Save to localStorage
    localStorage.setItem("lockTimes", JSON.stringify(times));
  };

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = callLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(callLogs.length / logsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">
        קביעת זמני נעילה{" "}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-right">
        <div className="mb-4">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-2">
            התחלת שעת נעילה :
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
            סיום שעת נעילה :
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
          שמירה{" "}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-md w-full max-w-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {savedTimes.start && savedTimes.end && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md w-full max-w-md text-right">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            :שעות נעילה שנשמרו
          </h3>
          <p className="text-green-700">התחלה: {savedTimes.start}</p>
          <p className="text-green-700">סיום: {savedTimes.end}</p>
        </div>
      )}

      {callLogs.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-md w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            יומן שיחות{" "}
          </h3>
          <ul className="list-disc list-inside">
            {currentLogs.map((log, index) => (
              <li key={index} className="text-gray-700">
                {dayjs(log).format("DD/MM/YYYY HH:mm:ss")}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed">
                הקודם
              </button>
              <span className="py-2 px-4 text-gray-700">
                עמוד {currentPage} מתוך {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed">
                הבא
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Ronit;
