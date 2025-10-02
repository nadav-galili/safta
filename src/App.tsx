import "./App.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

function App() {
  const [showUnavailable, setShowUnavailable] = useState(false);

  const isUnavailableTime = () => {
    const localHour = dayjs().hour();
    return localHour >= 22 || localHour < 7;
  };

  const handleButtonClick = () => {
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
    <div className="flex items-center justify-center min-h-screen">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full h-70 w-70 text-4xl font-bold transition-colors"
        onClick={handleButtonClick}>
        לחייג לרונית
      </button>
    </div>
  );
}

export default App;
