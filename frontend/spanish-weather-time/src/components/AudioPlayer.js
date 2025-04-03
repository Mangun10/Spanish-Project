import React from "react";
import { playRegionAudio, playWeatherAudio, playTimeAudio } from "../services/audioService";
import { audioButtonsTranslations } from "../services/translationService";

export const AudioPlayer = ({ region, weatherConditionCode, weatherConditionText, hour, timeString,showTranslations }) => {
  const handlePlayRegion = () => {
    playRegionAudio(region);
  };

  const handlePlayWeather = () => {
    if (weatherConditionCode && weatherConditionText) {
      playWeatherAudio(weatherConditionCode, weatherConditionText);
    }
  };

  const handlePlayTime = () => {
    if (hour !== undefined && timeString) {
      playTimeAudio(hour, timeString);
    }
  };

  // Check if we have weather and time data before enabling buttons
  const hasWeatherData = weatherConditionCode && weatherConditionText;
  const hasTimeData = hour !== undefined && timeString;
  console.log("Weather Data:", hasWeatherData, "Time Data:", hasTimeData);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button
          onClick={handlePlayRegion}
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          🎧 Región
          {showTranslations && (
            <span className="block text-xs mt-1 text-gray-800">
              ({audioButtonsTranslations['Región']})
            </span>
          )}
        </button>
        <button
          onClick={handlePlayWeather}
          className={`px-6 py-2 ${hasWeatherData ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'} text-white font-bold rounded-lg shadow-md transition`}
          disabled={!hasWeatherData}
        >
          🎧 Clima
          {showTranslations && (
            <span className="block text-xs mt-1">
              ({audioButtonsTranslations['Clima']})
            </span>
          )}
        </button>
        <button
          onClick={handlePlayTime}
          className={`px-6 py-2 ${hasTimeData ? 'bg-green-500 hover:bg-green-600' : 'bg-green-300 cursor-not-allowed'} text-white font-bold rounded-lg shadow-md transition`}
          disabled={!hasTimeData}
        >
          🎧 Hora
          {showTranslations && (
            <span className="block text-xs mt-1">
              ({audioButtonsTranslations['Hora']})
            </span>
          )}
        </button>
      </div>
      <button
        onClick={() => {
          handlePlayRegion();
          setTimeout(() => {
            if (hasWeatherData) handlePlayWeather();
            setTimeout(() => {
              if (hasTimeData) handlePlayTime();
            }, 1000);
          }, 1000);
        }}
        className="mt-4 px-6 py-2 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition w-full md:w-auto md:px-12"
      >
        🎧 Reproducir Todo
        {showTranslations && (
          <span className="block text-xs mt-1">
            ({audioButtonsTranslations['Reproducir Todo']})
          </span>
        )}
      </button>
    </div>
  );
};