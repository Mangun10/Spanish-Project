import React, { useState, useEffect } from "react";
import { WeatherCard } from "./components/WeatherCard";
import { TimeDisplay } from "./components/TimeDisplay";
import { AudioPlayer } from "./components/AudioPlayer";
import { fetchWeatherData } from "./services/weatherService";
import { fetchTimeData } from "./services/timeService";

const App = () => {
  const [region, setRegion] = useState("Madrid");
  const [weatherData, setWeatherData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [timeData, setTimeData] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);
  const [showTranslations, setShowTranslations] = useState(true);

  const regions = ["Madrid", "Barcelona", "Sevilla", "Valencia", "Bilbao"];

  // In App.js, make sure you update the time regularly
useEffect(() => {
  const fetchData = async () => {
    const weather = await fetchWeatherData(region);
    const time = await fetchTimeData(region);
    
    setWeatherData(weather);
    setTimeData(time);
    
    // Update the time immediately with current system time
    updateCurrentTime();
  };
  
  fetchData();
  
  // Function to update current time
  const updateCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    setCurrentHour(hours);
    setCurrentTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
  };
  
  // Update time every minute
  const timer = setInterval(updateCurrentTime, 60000);
  
  return () => clearInterval(timer);
}, [region]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-50 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tiempo y Hora en España</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className="px-3 py-1 bg-yellow-500 text-black text-sm rounded-md hover:bg-yellow-400 transition"
          >
            {showTranslations ? "Hide English" : "Show English"}
          </button>
          <select
            className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-md"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-10 p-6">
        {/* Title with translation */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Tiempo y Hora en España</h1>
          {showTranslations && (
            <p className="text-lg text-yellow-300 italic mt-1">
              (Weather and Time in Spain)
            </p>
          )}
        </div>

        {/* Weather Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard region={region} showTranslations={showTranslations} />
          <TimeDisplay region={region} showTranslations={showTranslations} />
        </div>

        {/* Pronunciation Section */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-semibold">Pronunciación en Español</h2>
          {showTranslations && (
            <p className="text-lg text-yellow-300 italic mt-1">
              (Spanish Pronunciation)
            </p>
          )}
          <p className="text-lg mt-2 opacity-80">
            Escucha la pronunciación del tiempo y la hora en {region}.
            {showTranslations && (
              <span className="block text-yellow-300 italic">
                (Listen to the pronunciation of weather and time in {region}.)
              </span>
            )}
          </p>
          <AudioPlayer 
            region={region} 
            weatherConditionCode={weatherData?.current?.condition?.code}
            weatherConditionText={weatherData?.current?.condition?.text} // Add this line
            hour={currentHour}
            timeString={currentTime} // Add this line
            showTranslations={showTranslations}
          />
        </div>
      </div>
    </div>
  );
};

export default App;