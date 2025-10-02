import "./App.css";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function App() {
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const isUnavailableTime = () => {
    const localHour = dayjs().hour();
    return localHour >= 22 || localHour < 7;
  };

  const handleButtonClick = () => {
    if (isUnavailableTime()) {
      setShowUnavailable(true);
    } else {
      // Make the call directly - force immediate dialing
      const phoneNumber = "0528842706";

      // Method that works best for one-click calling on mobile
      const link = document.createElement("a");
      link.href = `tel:${phoneNumber}`;
      link.style.position = "absolute";
      link.style.left = "-9999px";
      link.style.top = "-9999px";
      link.target = "_self";

      document.body.appendChild(link);

      // Force click with multiple methods for maximum compatibility
      link.click();

      // Also try window.location as backup
      setTimeout(() => {
        window.location.href = `tel:${phoneNumber}`;
      }, 50);

      // Clean up after a delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);
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

  // PWA Install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full h-70 w-70 text-4xl font-bold transition-colors"
        onClick={handleButtonClick}>
        לחייג לרונית
      </button>

      {showInstallButton && (
        <button
          className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          onClick={handleInstallClick}>
          📱 Install App
        </button>
      )}
    </div>
  );
}

export default App;
