import React, { useState, useEffect } from 'react';
import { getWeather } from '../api/weatherApi';

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getWeather('Madrid'); // Default city
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setError("Failed to load weather data. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="text-center my-8">Cargando...</div>;
  if (error) return <div className="text-center my-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-8">Spanish Weather & Time</h1>
      
      {weatherData && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
          <h2 className="text-xl font-bold mb-2">El Tiempo en Madrid</h2>
          <div className="flex items-center">
            <img 
              src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
              alt={weatherData.description}
              className="w-16 h-16"
            />
            <div>
              <p className="text-2xl">{weatherData.temperature}°C</p>
              <p className="capitalize">{weatherData.description}</p>
            </div>
          </div>
          <div className="mt-4">
            <p>Humedad: {weatherData.humidity}%</p>
            <p>Velocidad del viento: {weatherData.windSpeed} m/s</p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-lg">¡Aprende sobre el tiempo y la hora en español!</p>
      </div>
    </div>
  );
}

export default Home;