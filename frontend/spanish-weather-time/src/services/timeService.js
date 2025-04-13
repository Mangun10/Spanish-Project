const api_key = 'DUAXN0QCXZUV';

// services/timeService.js
const regionTimezones = {
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Sevilla': 'Europe/Madrid',
  'Valencia': 'Europe/Madrid',
  'Bilbao': 'Europe/Madrid',
};

// Helper function to determine if DST is active in Spain
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

// Helper function to format GMT offset from seconds to "+HH:MM" format
function formatOffset(offsetSeconds) {
  // Convert seconds to hours and minutes
  const totalMinutes = Math.abs(offsetSeconds) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Format with sign and padding
  const sign = offsetSeconds >= 0 ? '+' : '-';
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  
  return `${sign}${paddedHours}:${paddedMinutes}`;
}

// Map hour numbers to Spanish words
export const getHourWordInSpanish = (hour) => {
  const hourWords = {
    1: 'una',
    2: 'dos',
    3: 'tres',
    4: 'cuatro',
    5: 'cinco',
    6: 'seis',
    7: 'siete',
    8: 'ocho',
    9: 'nueve',
    10: 'diez',
    11: 'once',
    12: 'doce'
  };
  return hourWords[hour] || hour.toString();
};

// Map minute numbers to Spanish words
export const getMinuteWordInSpanish = (minute) => {
  // Special cases - direct mapping
  const minuteWords = {
    1: 'uno',
    2: 'dos',
    3: 'tres',
    4: 'cuatro',
    5: 'cinco',
    6: 'seis',
    7: 'siete',
    8: 'ocho',
    9: 'nueve',
    10: 'diez',
    11: 'once',
    12: 'doce',
    13: 'trece',
    14: 'catorce',
    15: 'quince',
    16: 'dieciséis',
    17: 'diecisiete',
    18: 'dieciocho',
    19: 'diecinueve',
    20: 'veinte',
    21: 'veintiuno',
    22: 'veintidós',
    23: 'veintitrés',
    24: 'veinticuatro',
    25: 'veinticinco',
    26: 'veintiséis',
    27: 'veintisiete',
    28: 'veintiocho',
    29: 'veintinueve',
    30: 'treinta',
    40: 'cuarenta',
    50: 'cincuenta'
  };
  
  // Direct mapping for common numbers
  if (minuteWords[minute]) {
    return minuteWords[minute];
  }
  
  // Compound numbers (31-39, 41-49, 51-59)
  if (minute > 30 && minute < 40) {
    return `treinta y ${getMinuteWordInSpanish(minute - 30)}`;
  } else if (minute > 40 && minute < 50) {
    return `cuarenta y ${getMinuteWordInSpanish(minute - 40)}`;
  } else if (minute > 50 && minute < 60) {
    return `cincuenta y ${getMinuteWordInSpanish(minute - 50)}`;
  }
  
  // Fallback for any unexpected values
  return minute.toString();
};

// Fetch time data using the TimezoneDB API
export const fetchTimeData = async (region) => {
  try {
    // Get timezone for the selected region (defaults to Madrid)
    const timezone = regionTimezones[region] || 'Europe/Madrid';
    
    // Build API URL
    const apiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${api_key}&format=json&by=zone&zone=${timezone}`;
    
    console.log(`🕒 Fetching time data for ${timezone}`);
    
    // Fetch the data
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Check if the request was successful
    if (data.status !== 'OK') {
      throw new Error(`API Error: ${data.message}`);
    }
    
    console.log('🕒 Received time data:', data);
    
    // Parse the formatted time
    const [datePart, timePart] = data.formatted.split(' ');
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    // Create a Date object for additional calculations
    const date = new Date(data.formatted);
    
    // Return structured time data
    return {
      datetime: date.toISOString(),
      formatted: data.formatted,
      timezone: data.zoneName,
      utc_offset: formatOffset(data.gmtOffset),
      dst: data.dst === "1",
      hours: hours,
      minutes: minutes,
      day_of_week: date.getDay(),
      day_of_year: Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24),
      abbreviation: data.abbreviation
    };
  } catch (error) {
    console.error('Error fetching time data from API:', error);
    
    // First fallback: Using browser's built-in timezone handling
    try {
      console.log('🕒 Using first fallback method to determine time');
      
      // Get current browser time
      const now = new Date();
      
      // Format it as if in Spain's timezone
      const spainTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
      const spainTime = new Date(spainTimeStr);
      
      console.log(`🕒 Fallback Spain time: ${spainTime}`);
      
      // Determine if DST is active in Spain using our helper function
      const isDST = isDSTinSpain(now);
      
      return {
        datetime: spainTime.toISOString(),
        formatted: spainTime.toLocaleString(),
        timezone: regionTimezones[region] || 'Europe/Madrid',
        utc_offset: isDST ? '+02:00' : '+01:00',
        dst: isDST,
        hours: spainTime.getHours(),
        minutes: spainTime.getMinutes(),
        day_of_week: spainTime.getDay(),
        day_of_year: Math.floor((spainTime - new Date(spainTime.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24),
        abbreviation: isDST ? 'CEST' : 'CET'
      };
    } catch (fallbackError) {
      console.error('First fallback time calculation failed:', fallbackError);
      
      // Second fallback: Direct time difference calculation
      try {
        console.log('🕒 Using second fallback method to determine time');
        
        // Direct time difference calculation as fallback
        const now = new Date();
        const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        // Spain is UTC+1 (standard) or UTC+2 (DST)
        const spainOffset = isDSTinSpain(now) ? 2 : 1;
        const spainTime = new Date(utcTime.getTime() + spainOffset * 3600000);
        
        console.log(`🕒 Fallback calculation used. DST active: ${spainOffset === 2 ? 'Yes' : 'No'}`);
        
        return {
          datetime: spainTime.toISOString(),
          formatted: spainTime.toLocaleString(),
          timezone: regionTimezones[region] || 'Europe/Madrid',
          utc_offset: spainOffset === 2 ? '+02:00' : '+01:00',
          dst: spainOffset === 2,
          hours: spainTime.getHours(),
          minutes: spainTime.getMinutes(),
          day_of_week: spainTime.getDay(),
          day_of_year: Math.floor((spainTime - new Date(spainTime.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24),
          abbreviation: spainOffset === 2 ? 'CEST' : 'CET'
        };
      } catch (secondFallbackError) {
        console.error('Second fallback time calculation failed:', secondFallbackError);
        
        // Last resort: use local time
        const localTime = new Date();
        return {
          datetime: localTime.toISOString(),
          formatted: localTime.toLocaleString(),
          timezone: 'Europe/Madrid',
          utc_offset: '+01:00',
          dst: false,
          hours: localTime.getHours(),
          minutes: localTime.getMinutes(),
          day_of_week: localTime.getDay(),
          abbreviation: 'CET'
        };
      }
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
  const date = datetime instanceof Date ? datetime : new Date(datetime);
  const hours = date.getHours();
  
  console.log("Current hours in getTimeOfDayInSpanish Function:", hours);
  

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
  // console.log("Current datetime in getFullTimeInSpanish Function:", datetime);
  const date = new Date(datetime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // console.log("in getfull time - Current hours:", hours, "Current minutes:", minutes);
  // Get hour in 12-hour format
  const hour12 = hours % 12 || 12;
  
  // Time of day phrase
  let timeOfDayPhrase = getTimeOfDayInSpanish(datetime);
  
  // For exact hours
  if (minutes === 0) {
    if (hour12 === 1) {
      return `Es la una ${timeOfDayPhrase}`;
    } else {
      return `Son las ${getHourWordInSpanish(hour12)} ${timeOfDayPhrase}`;
    }
  }
  
  // For minutes 1-30 (past the hour)
  if (minutes <= 30) {
    // Hour phrase
    const hourPhrase = hour12 === 1 ? 'Es la una' : `Son las ${getHourWordInSpanish(hour12)}`;
    
    // Handle special cases first
    if (minutes === 15) {
      return `${hourPhrase} y cuarto ${timeOfDayPhrase}`;
    } else if (minutes === 30) {
      return `${hourPhrase} y media ${timeOfDayPhrase}`;
    } else {
      // Regular minutes
      return `${hourPhrase} y ${getMinuteWordInSpanish(minutes)} ${timeOfDayPhrase}`;
    }
  } 
  // For minutes 31-59 (to the next hour)
  else {
    const nextHour = (hours + 1) % 24;
    const nextHour12 = nextHour % 12 || 12;
    const minutesToNextHour = 60 - minutes;
    
    // Hour phrase for the NEXT hour
    const hourPhrase = nextHour12 === 1 ? 'Es la una' : `Son las ${getHourWordInSpanish(nextHour12)}`;
    
    // Create a new date object for the next hour (for correct time of day)
    const nextHourDate = new Date(date);
    nextHourDate.setHours(nextHour);
    
    // Get time of day for the next hour
    let nextTimeOfDay = getTimeOfDayInSpanish(nextHourDate);
    
    if (minutesToNextHour === 15) {
      return `${hourPhrase} menos cuarto ${nextTimeOfDay}`;
    } else {
      return `${hourPhrase} menos ${getMinuteWordInSpanish(minutesToNextHour)} ${nextTimeOfDay}`;
    }
  }
};

// Get Spanish phrases for time expressions
export const getTimePhrasesInSpanish = () => {
  return {
    // Hour intro phrases
    'it is': 'son las',
    'it is one': 'es la una',
    
    // Minute connectors
    'and': 'y',
    'quarter': 'cuarto',
    'half': 'media',
    'less': 'menos',
    
    // Time of day
    'in the morning': 'de la mañana',
    'in the afternoon': 'de la tarde',
    'at night': 'de la noche',
    'at midnight': 'de la medianoche',
    
    // Other useful phrases
    'minute': 'minuto',
    'minutes': 'minutos',
    'hour': 'hora',
    'hours': 'horas',
    'o\'clock': 'en punto'
  };
};