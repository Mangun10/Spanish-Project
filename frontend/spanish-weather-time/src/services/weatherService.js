// services/weatherService.js
const API_KEY = 'fafac02b7ec54373a50152625253003'; // Your WeatherAPI.com API key

export const fetchWeatherData = async (city) => {
  try {
    console.log(`🌤️ Fetching weather data for ${city}...`);
    
    // Changed lang=es to lang=en to get English weather conditions
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city},spain&lang=en`
    );
    
    console.log(`🌤️ Weather API response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.warn(`🌤️ Weather API returned non-OK status: ${response.status}`);
      throw new Error('Weather data not available');
    }
    
    const data = await response.json();
    console.log('🌤️ Weather data received:', data);
    
    // Get the English condition text
    const englishCondition = data.current.condition.text;
    console.log(`🌤️ English condition: "${englishCondition}"`);
    
    // Translate to Spanish
    const spanishCondition = translateWeatherCondition(englishCondition);
    console.log(`🌤️ Translated to Spanish: "${spanishCondition}"`);
    
    // Create a new object with the English condition for internal use
    // and Spanish condition for display
    const enhancedData = {
      ...data,
      current: {
        ...data.current,
        condition: {
          ...data.current.condition,
          text: spanishCondition,
          text_english: englishCondition // Keep the English version for reference
        }
      }
    };
    
    return enhancedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to translate weather condition from English to Spanish
export const translateWeatherCondition = (condition) => {
  const translations = {
    // Basic conditions (most common)
    'Sunny': 'Soleado',
    'Clear': 'Despejado',
    'Partly cloudy': 'Parcialmente nublado',
    'Cloudy': 'Nublado',
    'Overcast': 'Cubierto',
    
    // Rain conditions
    'Light rain': 'Lluvia ligera',
    'Moderate rain': 'Lluvia moderada',
    'Heavy rain': 'Lluvia intensa',
    
    // Other common conditions
    'Fog': 'Niebla',
    'Mist': 'Neblina',
    'Thunderstorm': 'Tormenta',
    'Snow': 'Nieve',
    'Drizzle': 'Llovizna',
    'Windy': 'Ventoso'
  };
  
  // For conditions not in our limited list, try to match basic words
  if (!translations[condition]) {
    // Check if condition contains any of these key words
    if (condition.includes('rain')) return 'Lluvia';
    if (condition.includes('cloud')) return 'Nublado';
    if (condition.includes('thunder')) return 'Tormenta';
    if (condition.includes('snow')) return 'Nieve';
    if (condition.includes('fog') || condition.includes('mist')) return 'Niebla';
    if (condition.includes('sun')) return 'Soleado';
    if (condition.includes('clear')) return 'Despejado';
    if (condition.includes('wind')) return 'Ventoso';
    if (condition.includes('drizzle')) return 'Llovizna';
  }
  
  // Return the Spanish translation if available, otherwise return "Clima variable" (Variable weather)
  return translations[condition] || 'Clima variable';
};