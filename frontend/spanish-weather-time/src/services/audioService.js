// Import the Spanish word mapping functions from timeService.js
import { 
  getHourWordInSpanish, 
  getMinuteWordInSpanish, 
  fetchTimeData 
} from './timeService';

// Map weather conditions to audio file paths
const weatherAudioMap = {
  'Soleado': 'weather/soleado.mp3',
  'Despejado': 'weather/despejado.mp3',
  'Parcialmente nublado': 'weather/parcialmente-nublado.mp3',
  'Nublado': 'weather/nublado.mp3',
  'Cubierto': 'weather/cubierto.mp3',
  'Lluvia ligera': 'weather/lluvia-ligera.mp3',
  'Lluvia moderada': 'weather/lluvia-moderada.mp3',
  'Lluvia intensa': 'weather/lluvia-intensa.mp3',
  'Lluvia': 'weather/lluvia.mp3',
  'Niebla': 'weather/niebla.mp3',
  'Neblina': 'weather/neblina.mp3',
  'Tormenta': 'weather/tormenta.mp3',
  'Nieve': 'weather/nieve.mp3',
  'Llovizna': 'weather/llovizna.mp3',
  'Ventoso': 'weather/ventoso.mp3',
  'Clima variable': 'weather/clima-variable.mp3'
};

// Map regions to audio file paths
const regionAudioMap = {
  'Madrid': 'regions/madrid.mp3',
  'Barcelona': 'regions/barcelona.mp3',
  'Sevilla': 'regions/sevilla.mp3',
  'Valencia': 'regions/valencia.mp3',
  'Bilbao': 'regions/bilbao.mp3'
};

// Function to play audio files
const playAudio = (filePath) => {
  try {
    console.log(`🔊 Playing audio: ${filePath}`);
    const audio = new Audio(`/assets/audio/${filePath}`);
    
    return audio.play().catch(error => {
      console.error(`🔊 Error playing audio: ${error.message}`);
      // Fall back to speech synthesis if audio file fails
      if ('speechSynthesis' in window) {
        const text = filePath.split('/').pop().replace('.mp3', '').replace(/-/g, ' ');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    });
  } catch (error) {
    console.error(`🔊 Error setting up audio: ${error.message}`);
  }
};

// Play region audio
export const playRegionAudio = (region) => {
  const audioFile = regionAudioMap[region];
  
  if (audioFile) {
    // Play the audio file for the region
    playAudio(audioFile);
  } else {
    // Fallback to speech synthesis
    alert(`🔊 Pronunciación: "La región es ${region}"`);
  }
};

// Play weather audio
export const playWeatherAudio = (conditionCode, conditionText) => {
  const audioFile = weatherAudioMap[conditionText];
  
  if (audioFile) {
    // Play the audio file for the weather condition
    playAudio(audioFile);
  } else {
    alert(`🔊 Pronunciación: "El tiempo está ${conditionText}"`);
  }
};

// Play time audio with API data integration
export const playTimeAudio = async (region, hour, timeString) => {
  // Create a queue of audio files to play
  const queue = [];
  
  let hours, minutes;
  
  try {
    // First priority: Get time data from API directly
    if (region) {
      const timeData = await fetchTimeData(region);
      if (timeData && (timeData.hours !== undefined || timeData.formatted)) {
        if (timeData.hours !== undefined) {
          hours = timeData.hours;
          minutes = timeData.minutes || 0;
        } else if (timeData.formatted) {
          const [datePart, timePart] = timeData.formatted.split(' ');
          const [hoursStr, minutesStr] = timePart.split(':');
          hours = parseInt(hoursStr);
          minutes = parseInt(minutesStr);
        } else if (timeData.datetime) {
          const date = new Date(timeData.datetime);
          hours = date.getHours();
          minutes = date.getMinutes();
        }
        console.log(`🔊 Using API time data for ${region}: ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
      }
    }
  } catch (error) {
    console.error("Error fetching time data from API:", error);
    // Will fall through to use provided hour/timeString or local time
  }
  
  // Second priority: Use explicit hour/timeString parameters if API failed or no region
  if (hours === undefined && (hour !== undefined || timeString)) {
    const date = new Date();
    if (hour !== undefined) {
      date.setHours(hour);
    }
    if (timeString) {
      const [hoursStr, minutesStr] = timeString.split(':');
      const h = parseInt(hoursStr);
      const m = parseInt(minutesStr);
      
      date.setHours(h);
      date.setMinutes(m);
    }
    hours = date.getHours();
    minutes = date.getMinutes();
    console.log(`🔊 Using provided time parameters: ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
  } 
  
  // Last resort: use local time if neither API nor explicit parameters worked
  if (hours === undefined) {
    const now = new Date();
    hours = now.getHours();
    minutes = now.getMinutes();
    console.warn(`🔊 WARNING: Falling back to local browser time: ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
  }
  
  // Convert hours to 12-hour format
  const hour12 = hours % 12 || 12;
  console.log(`🔊 Processing time: ${hours}:${minutes} (${hour12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'})`);
  
  // Step 1: Add the hour introductory phrase (Son las / Es la)
  if (minutes <= 30) {
    // For minutes 0-30, we use the current hour
    if (hour12 === 1) {
      // "Es la una..."
      queue.push('time/es-la-una.mp3');
    } else {
      // "Son las dos/tres/cuatro..."
      queue.push('time/son-las.mp3');
      queue.push(`time/${getHourWordInSpanish(hour12)}.mp3`);
    }
  } else {
    // For minutes 31-59, we reference the next hour
    const nextHour = (hours + 1) % 24;
    const nextHour12 = nextHour % 12 || 12;
    
    if (nextHour12 === 1) {
      // "Es la una menos..."
      queue.push('time/es-la-una.mp3');
      queue.push('time/menos.mp3');
    } else {
      // "Son las X menos..."
      queue.push('time/son-las.mp3');
      queue.push(`time/${getHourWordInSpanish(nextHour12)}.mp3`);
      queue.push('time/menos.mp3');
    }
  }
  
  // Step 2: Handle minutes
  if (minutes === 0) {
    // Exact hour, no additional audio needed
  } else if (minutes === 15) {
    // "y cuarto"
    queue.push('time/y.mp3');
    queue.push('time/cuarto.mp3');
  } else if (minutes === 30) {
    // "y media"
    queue.push('time/y.mp3');
    queue.push('time/media.mp3');
  } else if (minutes === 45) {
    // "menos cuarto" - already handled in the hour section
    queue.push('time/cuarto.mp3');
  } else if (minutes < 30) {
    // "y [minutes]" - without "minutos"
    queue.push('time/y.mp3');
    
    // Add pronunciation for the specific minute
    if (minutes <= 15 || minutes === 20) {
      // Direct mapping for 1-15 and 20
      queue.push(`time/${getMinuteWordInSpanish(minutes)}.mp3`);
    } 
    else if (minutes >= 16 && minutes <= 19) {
      // For 16-19, use compound numbers (dieciséis, diecisiete, etc.)
      const compoundName = {
        16: 'dieciseis',
        17: 'diecisiete',
        18: 'dieciocho',
        19: 'diecinueve'
      };
      
      // Check if we have a compound number audio file
      if (compoundName[minutes]) {
        queue.push(`time/${compoundName[minutes]}.mp3`);
      } else {
        // Fallback to separated numbers if the compound file doesn't exist
        queue.push('time/diez.mp3');
        queue.push('time/y.mp3');
        const ones = minutes - 10;
        queue.push(`time/${getMinuteWordInSpanish(ones)}.mp3`);
      }
    }
    else if (minutes >= 21 && minutes <= 29) {
      // For 21-29, use compound numbers (veintiuno, veintidós, etc.)
      const compoundName = {
        21: 'veintiuno',
        22: 'veintidos',
        23: 'veintitres',
        24: 'veinticuatro',
        25: 'veinticinco',
        26: 'veintiseis',
        27: 'veintisiete',
        28: 'veintiocho',
        29: 'veintinueve'
      };
      
      // Check if we have a compound number audio file
      if (compoundName[minutes]) {
        queue.push(`time/${compoundName[minutes]}.mp3`);
      } else {
        // Fallback to separated numbers if the compound file doesn't exist
        queue.push('time/veinte.mp3');
        queue.push('time/y.mp3');
        const ones = minutes - 20;
        queue.push(`time/${getMinuteWordInSpanish(ones)}.mp3`);
      }
    }
  } else {
    // For minutes > 30, use "menos" format
    const minutesToNextHour = 60 - minutes;
    
    // We've already added "menos" in the hour section for these cases
    if (minutesToNextHour === 15) {
      // "menos cuarto" - cuarto part
      queue.push('time/cuarto.mp3');
    } else {
      // Add the number of minutes to the next hour
      if (minutesToNextHour <= 15 || minutesToNextHour === 20) {
        // Direct mapping for common numbers
        queue.push(`time/${getMinuteWordInSpanish(minutesToNextHour)}.mp3`);
      } 
      else if (minutesToNextHour >= 16 && minutesToNextHour <= 19) {
        // For 16-19, use compound numbers
        const compoundName = {
          16: 'dieciseis',
          17: 'diecisiete',
          18: 'dieciocho',
          19: 'diecinueve'
        };
        
        if (compoundName[minutesToNextHour]) {
          queue.push(`time/${compoundName[minutesToNextHour]}.mp3`);
        } else {
          // Fallback
          queue.push('time/diez.mp3');
          queue.push('time/y.mp3');
          const ones = minutesToNextHour - 10;
          queue.push(`time/${getMinuteWordInSpanish(ones)}.mp3`);
        }
      }
      else if (minutesToNextHour >= 21 && minutesToNextHour <= 29) {
        // For 21-29, use compound numbers
        const compoundName = {
          21: 'veintiuno',
          22: 'veintidos',
          23: 'veintitres',
          24: 'veinticuatro',
          25: 'veinticinco',
          26: 'veintiseis',
          27: 'veintisiete',
          28: 'veintiocho',
          29: 'veintinueve'
        };
        
        if (compoundName[minutesToNextHour]) {
          queue.push(`time/${compoundName[minutesToNextHour]}.mp3`);
        } else {
          // Fallback
          queue.push('time/veinte.mp3');
          queue.push('time/y.mp3');
          const ones = minutesToNextHour - 20;
          queue.push(`time/${getMinuteWordInSpanish(ones)}.mp3`);
        }
      }
    }
  }
  
  // Step 3: Add time of day
  if (hours >= 6 && hours < 12) {
    queue.push('time/de-la-mañana.mp3');
  } else if (hours >= 12 && hours < 21) {
    queue.push('time/de-la-tarde.mp3');
  } else {
    queue.push('time/de-la-noche.mp3');
  }
  
  console.log("Audio queue:", queue);
  
  // Play audio queue sequentially with a delay
  playAudioQueue(queue, {
    defaultDelay: 400,
    timeComponentDelay: 200
  });
};

// Helper function to play a queue of audio files sequentially with delays
function playAudioQueue(queue, options = {}) {
  if (queue.length === 0) return;
  
  // Default delays
  const defaultDelay = options.defaultDelay || 400; // Regular delay between words
  const timeComponentDelay = options.timeComponentDelay || 200; // Shorter delay within time components
  
  // Track what type of content we're playing
  let currentSection = null;
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= queue.length) return;
    
    const audioItem = queue[currentIndex];
    let audioPath, sectionType;
    
    // Check if this is an object with section info or just a string path
    if (typeof audioItem === 'object') {
      audioPath = audioItem.path;
      sectionType = audioItem.section;
    } else {
      audioPath = audioItem;
      // Determine section type based on path
      if (audioPath.startsWith('regions/')) {
        sectionType = 'region';
      } else if (audioPath.startsWith('weather/')) {
        sectionType = 'weather';
      } else if (audioPath.startsWith('time/')) {
        sectionType = 'time';
      } else {
        sectionType = 'other';
      }
    }
    
    // Create and play the audio
    const audio = new Audio(`/assets/audio/${audioPath}`);
    
    audio.onended = () => {
      const prevSection = currentSection;
      currentSection = sectionType;
      currentIndex++;
      
      if (currentIndex < queue.length) {
        // Determine which delay to use
        let delayToUse = defaultDelay;
        
        // If we're within the time section, use shorter delay for natural flow
        if (sectionType === 'time' && prevSection === 'time') {
          delayToUse = timeComponentDelay;
        }
        
        setTimeout(playNext, delayToUse);
      }
    };
    
    audio.onerror = (e) => {
      console.error(`Error playing audio file: ${audioPath}`, e);
      currentIndex++;
      setTimeout(playNext, defaultDelay);
    };
    
    console.log(`Playing audio: ${audioPath} (${sectionType})`);
    audio.play().catch(e => {
      console.error(`Error starting audio: ${e.message}`);
      currentIndex++;
      setTimeout(playNext, defaultDelay);
    });
  };
  
  playNext();
}