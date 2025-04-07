import React, { useState, useEffect } from "react";
import { fetchWeatherData } from "../services/weatherService";
import { weatherDataTranslations, weatherTranslations, regionInfo } from "../services/translationService";

export const WeatherCard = ({ region, showTranslations }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      const data = await fetchWeatherData(region);
      console.log("Weather data in weather card.js:", data);
      if (data) {
        setWeather(data);
        setError(null);
      } else {
        setError("No se pudo cargar el tiempo");
      }
      setLoading(false);
    };

    getWeatherData();
  }, [region]);

  if (loading) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
        <p>Cargando datos del tiempo...</p>
        {showTranslations && <p className="text-yellow-300 italic">(Loading weather data...)</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
        <p>{error}</p>
        {showTranslations && <p className="text-yellow-300 italic">(Could not load weather data)</p>}
      </div>
    );
  }

// Current code (not working correctly):
const conditionText = weather.current.condition.text;
// const englishCondition = weatherTranslations[conditionText] || conditionText;

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold">{region}</h2>

      <div className="mt-4 flex flex-col items-center">
        <img 
          src={`https:${weather.current.condition.icon}`} 
          alt={weather.current.condition.text}
          className="w-20 h-20"
        />
        <p className="text-3xl font-bold mt-2">{Math.round(weather.current.temp_c)}°C</p>
        <p className="text-lg">{weather.current.condition.text}</p>
        {showTranslations && (
          <p className="text-yellow-300 italic text-sm">{weather.current.condition.text_english}</p>
        )}

        <div className="mt-4 text-sm grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="bg-white bg-opacity-10 p-2 rounded">
            <p>{weatherDataTranslations['Feels like']}</p>
            {showTranslations && (
              <p className="text-yellow-300 italic text-xs">Feels like</p>
            )}
            <p className="font-bold">{Math.round(weather.current.feelslike_c)}°C</p>
          </div>
          <div className="bg-white bg-opacity-10 p-2 rounded">
            <p>{weatherDataTranslations['Humidity']}</p>
            {showTranslations && (
              <p className="text-yellow-300 italic text-xs">Humidity</p>
            )}
            <p className="font-bold">{weather.current.humidity}%</p>
          </div>
          <div className="bg-white bg-opacity-10 p-2 rounded">
            <p>{weatherDataTranslations['Wind']}</p>
            {showTranslations && (
              <p className="text-yellow-300 italic text-xs">Wind</p>
            )}
            <p className="font-bold">{Math.round(weather.current.wind_kph)} km/h</p>
          </div>
          <div className="bg-white bg-opacity-10 p-2 rounded">
            <p>{weatherDataTranslations['UV Index']}</p>
            {showTranslations && (
              <p className="text-yellow-300 italic text-xs">UV Index</p>
            )}
            <p className="font-bold">{weather.current.uv}</p>
          </div>
        </div>
        {/* <p className="text-xs mt-4 text-gray-200">
          Actualizado: {weather.current.last_updated}
          {showTranslations && (
            <span className="block text-yellow-300 italic">Updated: {weather.current.last_updated}</span>
          )}
        </p> */}
      </div>
    </div>
  );
};