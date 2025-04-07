import React, { useState, useEffect } from "react";
import { timeTranslations } from "../services/translationService";
import { 
  fetchTimeData, 
  getFullTimeInSpanish,
  formatTimeInSpanish,
  formatDateInSpanish
} from "../services/timeService";

export const TimeDisplay = ({ region, showTranslations }) => {
  const [timeData, setTimeData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [fullTimePhrase, setFullTimePhrase] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTimeData = async () => {
      setLoading(true);
      const data = await fetchTimeData(region);
      if (data) {
        setTimeData(data);
        
        // Use manual formatting functions instead of built-in formatters
        setCurrentTime(formatTimeInSpanish(data.datetime));
        setCurrentDate(formatDateInSpanish(data.datetime));
        setFullTimePhrase(getFullTimeInSpanish(data.datetime));
        
        setError(null);
      } else {
        setError("No se pudo cargar la hora");
      }
      setLoading(false);
    };

    getTimeData();
    
    // Update time every minute using our manual formatters
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTimeInSpanish(now));
      setFullTimePhrase(getFullTimeInSpanish(now));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [region]);

  if (loading) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
        <p>Cargando datos del tiempo...</p>
        {showTranslations && <p className="text-yellow-300 italic">(Loading time data...)</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
        <p>{error}</p>
        {showTranslations && <p className="text-yellow-300 italic">(Could not load time data)</p>}
      </div>
    );
  }

  // Get hours for translation (extract from current time)
  const hours = new Date(timeData.datetime).getHours();
  const periodOfDay = hours < 12 ? 'de la mañana' : 
                     (hours < 20 ? 'de la tarde' : 'de la noche');
  const periodTranslation = timeTranslations[periodOfDay];

  // For English translation, use the browser's formatter
  const englishDate = new Date(timeData.datetime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold">{region}</h2>
      
      <div className="mt-4">
        <p className="text-5xl mb-2">🕒</p>
        <p className="text-3xl font-bold">{currentTime}</p>
        
        <p className="text-sm mt-2">
          {fullTimePhrase}
        </p>
        
        {showTranslations && (
          <p className="text-yellow-300 italic text-xs mt-1">
            It's {currentTime} {periodTranslation}
          </p>
        )}
        
        <p className="text-lg mt-4 first-letter:uppercase">
          {currentDate}
        </p>
        
        {showTranslations && (
          <p className="text-yellow-300 italic text-sm mt-1">
            {englishDate}
          </p>
        )}
      </div>
    </div>
  );
};