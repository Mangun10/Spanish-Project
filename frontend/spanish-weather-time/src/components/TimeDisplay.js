import React, { useState, useEffect } from "react";
import { fetchTimeData } from "../services/timeService";
import { timeTranslations, regionInfo } from "../services/translationService";

export const TimeDisplay = ({ region, showTranslations }) => {
  const [timeData, setTimeData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTimeData = async () => {
      setLoading(true);
      const data = await fetchTimeData(region);
      if (data) {
        setTimeData(data);
        const date = new Date(data.datetime);
        
        // Format time in Spanish
        setCurrentTime(`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`);
        
        // Format date in Spanish
        const spanishDate = new Intl.DateTimeFormat('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
        setCurrentDate(spanishDate);
        
        setError(null);
      } else {
        setError("No se pudo cargar la hora");
      }
      setLoading(false);
    };

    getTimeData();
    
    // Update time every minute
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [region]);

  // Get the period of day based on hours
  const getPeriodOfDay = (hours) => {
    if (hours < 12) {
      return 'de la mañana';
    } else if (hours < 20) {
      return 'de la tarde';
    } else {
      return 'de la noche';
    }
  };

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

  // Get hours for translation
  const hours = parseInt(currentTime.split(':')[0]);
  const periodOfDay = getPeriodOfDay(hours);
  const periodTranslation = timeTranslations[periodOfDay];

  // Format date in English for translation
  const englishDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(timeData.datetime));

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold">{region}</h2>
      

      <div className="mt-4">
        <p className="text-5xl mb-2">🕒</p>
        <p className="text-3xl font-bold">{currentTime}</p>
        
        <p className="text-sm mt-2">
          Son las {currentTime} {periodOfDay}
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