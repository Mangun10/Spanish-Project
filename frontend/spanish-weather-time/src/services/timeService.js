// services/timeService.js
const regionTimezones = {
    'Madrid': 'Europe/Madrid',
    'Barcelona': 'Europe/Madrid',
    'Sevilla': 'Europe/Madrid',
    'Valencia': 'Europe/Madrid',
    'Bilbao': 'Europe/Madrid',
    // Spain uses the same timezone, but this structure allows for future expansion
  };
  
  export const fetchTimeData = async (region) => {
    try {
      const timezone = regionTimezones[region] || 'Europe/Madrid';
      const response = await fetch(
        `https://worldtimeapi.org/api/timezone/${timezone}`
        
      );
      
      if (!response.ok) {
        throw new Error('Time data not available');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching time data:', error);
      // Fallback to local time if API fails
      return {
        datetime: new Date().toISOString(),
        timezone: regionTimezones[region]
      };
    }
  };
  
  // Function to format time in Spanish
  export const formatTimeInSpanish = (datetime) => {
    if (!datetime) return '';
    
    const date = new Date(datetime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };
  
  // Function to format date in Spanish
  export const formatDateInSpanish = (datetime) => {
    if (!datetime) return '';
    
    const date = new Date(datetime);
    const options = {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    return date.toLocaleDateString('es-ES', options);
  };