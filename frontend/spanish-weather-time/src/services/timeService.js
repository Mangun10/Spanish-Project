// services/timeService.js
const regionTimezones = {
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Sevilla': 'Europe/Madrid',
  'Valencia': 'Europe/Madrid',
  'Bilbao': 'Europe/Madrid',
};

// Helper function to determine if DST is active in Spain - place this BEFORE fetchTimeData
function isDSTinSpain(date) {
  // Spain follows EU DST rules: 
  // DST begins last Sunday of March at 1:00 UTC
  // DST ends last Sunday of October at 1:00 UTC
  const year = date.getFullYear();
  
  // Get last Sunday in March
  const marchLastDay = new Date(Date.UTC(year, 2, 31));
  while (marchLastDay.getUTCDay() !== 0) {
    marchLastDay.setUTCDate(marchLastDay.getUTCDate() - 1);
  }
  const dstStart = new Date(Date.UTC(year, 2, marchLastDay.getUTCDate(), 1, 0, 0));
  
  // Get last Sunday in October
  const octoberLastDay = new Date(Date.UTC(year, 9, 31));
  while (octoberLastDay.getUTCDay() !== 0) {
    octoberLastDay.setUTCDate(octoberLastDay.getUTCDate() - 1);
  }
  const dstEnd = new Date(Date.UTC(year, 9, octoberLastDay.getUTCDate(), 1, 0, 0));
  
  // Check if current date is within DST period
  return date >= dstStart && date < dstEnd;
}

// Now the main fetchTimeData function
export const fetchTimeData = async (region) => {
  try {
    // Get current time
    const now = new Date();
    
    // Check if DST is active using our helper function
    const isDST = isDSTinSpain(now);
    console.log(`🕒 DST active in Spain (per calculation): ${isDST ? 'Yes' : 'No'}`);
    
    // Get Spain time directly using the browser's built-in time zone handling
    const spainTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
    const spainTime = new Date(spainTimeStr);
    
    console.log(`🕒 Local browser time: ${now.toISOString()}`);
    console.log(`🕒 Calculated Spain time: ${spainTime.toISOString()}`);
    
    // Create response object
    return {
      datetime: spainTime.toISOString(),
      timezone: regionTimezones[region] || 'Europe/Madrid',
      utc_offset: isDST ? '+02:00' : '+01:00',
      dst: isDST,
      day_of_week: spainTime.getDay(),
      day_of_year: Math.floor((spainTime - new Date(spainTime.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    };
  } catch (error) {
    console.error('Error calculating time data:', error);
    // Fallback to direct calculation without time zones
    try {
      // Direct time difference calculation as fallback
      const now = new Date();
      const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      // Spain is UTC+1 (standard) or UTC+2 (DST)
      const spainOffset = isDSTinSpain(now) ? 2 : 1;
      const spainTime = new Date(utcTime.getTime() + spainOffset * 3600000);
      
      console.log(`🕒 Fallback calculation used. DST active: ${spainOffset === 2 ? 'Yes' : 'No'}`);
      
      return {
        datetime: spainTime.toISOString(),
        timezone: regionTimezones[region] || 'Europe/Madrid',
        utc_offset: spainOffset === 2 ? '+02:00' : '+01:00',
        dst: spainOffset === 2,
        day_of_week: spainTime.getDay(),
        day_of_year: Math.floor((spainTime - new Date(spainTime.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
      };
    } catch (fallbackError) {
      console.error('Fallback time calculation failed:', fallbackError);
      return {
        datetime: new Date().toISOString(),
        timezone: regionTimezones[region] || 'Europe/Madrid',
        utc_offset: '+01:00',
        dst: false
      };
    }
  }
};

// Function to format time in Spanish in 12-hour format without AM/PM
export const formatTimeInSpanish = (datetime) => {
  if (!datetime) return '';
  
  // Make sure we're working with a proper Date object
  const date = new Date(datetime);
  
  // Get hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours) as 12
  
  // Format with leading zeros for minutes
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  // Create the final formatted time
  const formattedTime = `${hours}:${formattedMinutes}`;
  
  return formattedTime;
};

// Function to format date in Spanish manually
export const formatDateInSpanish = (datetime) => {
  if (!datetime) return '';
  
  const date = new Date(datetime);
  
  // Day of week in Spanish
  const daysInSpanish = [
    'domingo', 'lunes', 'martes', 'miércoles', 
    'jueves', 'viernes', 'sábado'
  ];
  
  // Months in Spanish
  const monthsInSpanish = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const dayOfWeek = daysInSpanish[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = monthsInSpanish[date.getMonth()];
  const year = date.getFullYear();
  
  // Format: "lunes, 1 de enero de 2023"
  return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
};

// Function to get time of day in Spanish
export const getTimeOfDayInSpanish = (datetime) => {
  if (!datetime) return '';
  
  const date = new Date(datetime);
  const hours = date.getHours();
  
  // Determine time of day in Spanish
  if (hours >= 6 && hours < 12) {
    return 'de la mañana';
  } else if (hours >= 12 && hours < 21) {
    return 'de la tarde';
  } else {
    return 'de la noche';
  }
};

// Function to get the full time expression in Spanish
export const getFullTimeInSpanish = (datetime) => {
  if (!datetime) return '';
  
  const date = new Date(datetime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Determine the hour phrase
  let hourPhrase = '';
  const hour12 = hours % 12 || 12;
  
  // For exact hours
  if (minutes === 0) {
    if (hours === 1 || hours === 13) {
      return `Es la una ${getTimeOfDayInSpanish(datetime)}`;
    } else {
      return `Son las ${hour12} ${getTimeOfDayInSpanish(datetime)}`;
    }
  }
  
  // For minutes 1-30 (past the hour)
  if (minutes <= 30) {
    if (hours === 1 || hours === 13) {
      hourPhrase = 'Es la una';
    } else {
      hourPhrase = `Son las ${hour12}`;
    }
    
    if (minutes === 15) {
      return `${hourPhrase} y cuarto ${getTimeOfDayInSpanish(datetime)}`;
    } else if (minutes === 30) {
      return `${hourPhrase} y media ${getTimeOfDayInSpanish(datetime)}`;
    } else {
      return `${hourPhrase} y ${minutes}  ${getTimeOfDayInSpanish(datetime)}`;
    }
  } 
  // For minutes 31-59 (to the next hour)
  else {
    const nextHour = (hours + 1) % 24;
    const nextHour12 = nextHour % 12 || 12;
    const minutesToNextHour = 60 - minutes;
    
    if (nextHour === 1 || nextHour === 13) {
      hourPhrase = 'Es la una';
    } else {
      hourPhrase = `Son las ${nextHour12}`;
    }
    
    // Create a new date object for the next hour (without modifying the original)
    const nextHourDate = new Date(date);
    nextHourDate.setHours(nextHour);
    
    if (minutesToNextHour === 15) {
      return `Son menos cuarto para ${nextHour === 1 || nextHour === 13 ? 'la una' : 'las ' + nextHour12} ${getTimeOfDayInSpanish(nextHourDate)}`;
    } else {
      return `Son las ${nextHour12} menos ${minutesToNextHour} ${getTimeOfDayInSpanish(nextHourDate)}`;
    }
  }
};