// services/weatherService.js
const API_KEY = 'fafac02b7ec54373a50152625253003'; // Replace with your WeatherAPI.com API key

export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city},spain&lang=es`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to translate weather condition to Spanish
// Note: With lang=es parameter, the API should already return Spanish condition text
// This is a fallback in case you need custom translations
export const translateWeatherCondition = (condition) => {
  // Since WeatherAPI.com provides translations with lang=es,
  // this function may not be needed, but kept for special cases
  const translations = {
    'sunny': 'Soleado',
    'partly cloudy': 'Parcialmente nublado',
    'cloudy': 'Nublado',
    'overcast': 'Cubierto',
    'mist': 'Niebla',
    'patchy rain possible': 'Posibilidad de lluvia irregular',
    'patchy snow possible': 'Posibilidad de nieve irregular',
    'patchy sleet possible': 'Posibilidad de aguanieve irregular',
    'patchy freezing drizzle possible': 'Posibilidad de llovizna helada irregular',
    'thundery outbreaks possible': 'Posibles tormentas eléctricas',
    'light rain': 'Lluvia ligera',
    'moderate rain': 'Lluvia moderada',
    'heavy rain': 'Lluvia intensa',
    'light snow': 'Nieve ligera',
    'moderate snow': 'Nieve moderada',
    'heavy snow': 'Nieve intensa',
    'fog': 'Niebla'
    // Add more translations as needed
  };
  
  return translations[condition.toLowerCase()] || condition;
};