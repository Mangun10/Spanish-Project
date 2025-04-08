// services/audioService.js

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

// Map hours to audio file paths (for time phrases)
// const timeAudioMap = {
//   // Hours
//   '1': 'time/es-la-una.mp3',
//   '2': 'time/son-las-dos.mp3',
//   '3': 'time/son-las-tres.mp3',
//   '4': 'time/son-las-cuatro.mp3',
//   '5': 'time/son-las-cinco.mp3',
//   '6': 'time/son-las-seis.mp3',
//   '7': 'time/son-las-siete.mp3',
//   '8': 'time/son-las-ocho.mp3',
//   '9': 'time/son-las-nueve.mp3',
//   '10': 'time/son-las-diez.mp3',
//   '11': 'time/son-las-once.mp3',
//   '12': 'time/son-las-doce.mp3',
  
//   // Time of day
//   'morning': 'time/de-la-mañana.mp3',
//   'noon': 'time/del-mediodia.mp3',
//   'afternoon': 'time/de-la-tarde.mp3',
//   'night': 'time/de-la-noche.mp3'
// };

// Add a new map for filler phrases
// const phrasesAudioMap = {
//   'intro-region': 'phrases/la-region-es.mp3',
//   'intro-weather': 'phrases/el-tiempo-esta.mp3',
//   'intro-time': 'phrases/la-hora-es.mp3',
//   'y': 'phrases/y.mp3',
//   'minutos': 'phrases/minutos.mp3',
//   'en': 'phrases/en.mp3',
//   'bienvenido': 'phrases/bienvenido-a.mp3',
//   'escucha': 'phrases/escucha-la-pronunciacion-de.mp3',
//   'punto': 'phrases/punto.mp3',
//   'menos': 'phrases/menos.mp3',
//   'minuto': 'phrases/minuto.mp3'
// };

// // Add this after your other audio maps
// const minutesAudioMap = {
//   '1': 'time/minutes/uno.mp3',
//   '2': 'time/minutes/dos.mp3',
//   '3': 'time/minutes/tres.mp3',
//   '4': 'time/minutes/cuatro.mp3',
//   '5': 'time/minutes/cinco.mp3',
//   '6': 'time/minutes/seis.mp3',
//   '7': 'time/minutes/siete.mp3',
//   '8': 'time/minutes/ocho.mp3',
//   '9': 'time/minutes/nueve.mp3',
//   '10': 'time/minutes/diez.mp3',
//   '11': 'time/minutes/once.mp3',
//   '12': 'time/minutes/doce.mp3',
//   '13': 'time/minutes/trece.mp3',
//   '14': 'time/minutes/catorce.mp3',
//   '15': 'time/minutes/quince.mp3',
//   '20': 'time/minutes/veinte.mp3',
//   '30': 'time/minutes/treinta.mp3',
//   '40': 'time/minutes/cuarenta.mp3',
//   '50': 'time/minutes/cincuenta.mp3',
//   'cuarto': 'time/minutes/cuarto.mp3',
//   'media': 'time/minutes/media.mp3'
// };

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

// Use the Web Speech API for text-to-speech
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

export const playWeatherAudio = (conditionCode, conditionText) => {
  const audioFile = weatherAudioMap[conditionText];
  
  if (audioFile) {
    // Play the audio file for the weather condition
    playAudio(audioFile);
  } else {
    alert(`🔊 Pronunciación: "El tiempo está ${conditionText}"`);
    
  }
};

export const playTimeAudio = (hour, timeString) => {
  // Get time data
  const date = new Date();
  if (hour) {
    date.setHours(hour);
  }
  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
  }
  
  // Create a queue of audio files to play
  const queue = [];
  
  // Parse the hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hour12 = hours % 12 || 12;
  console.log(`🔊 Current time: ${hours}:${minutes}`);
  
  // Step 1: Add the hour introductory phrase (Son las / Es la)
  if (minutes <= 30) {
    // For minutes 0-30, we use the current hour
    if (hour12 === 1) {
      // "Es la una..."
      queue.push('time/es-la-una.mp3');
    } else {
      // "Son las dos/tres/cuatro..."
      queue.push('time/son-las.mp3');
      queue.push(`time/${getHourName(hour12)}.mp3`);
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
      queue.push(`time/${getHourName(nextHour12)}.mp3`);
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
      queue.push(`time/${getMinuteName(minutes)}.mp3`);
    } 
    else if (minutes > 15 && minutes < 20) {
      // 16-19: diez + y + single digit
      queue.push('time/diez.mp3');
      queue.push('time/y.mp3');
      const ones = minutes - 10;
      queue.push(`time/${getMinuteName(ones)}.mp3`);
    }
    else if (minutes > 20 && minutes < 30) {
      // 21-29: veinte + y + single digit
      queue.push('time/veinte.mp3');
      queue.push('time/y.mp3');
      const ones = minutes - 20;
      queue.push(`time/${getMinuteName(ones)}.mp3`);
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
        queue.push(`time/${getMinuteName(minutesToNextHour)}.mp3`);
      } 
      else if (minutesToNextHour > 15 && minutesToNextHour < 20) {
        // 16-19: diez + y + single digit
        queue.push('time/diez.mp3');
        queue.push('time/y.mp3');
        const ones = minutesToNextHour - 10;
        queue.push(`time/${getMinuteName(ones)}.mp3`);
      }
      else if (minutesToNextHour > 20 && minutesToNextHour < 30) {
        // 21-29: veinte + y + single digit
        queue.push('time/veinte.mp3');
        queue.push('time/y.mp3');
        const ones = minutesToNextHour - 20;
        queue.push(`time/${getMinuteName(ones)}.mp3`);
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
    sectionDelay: 1000,
    timeComponentDelay: 200
  });
};

// Helper function to get hour name in Spanish
function getHourName(hour) {
  const hourNames = {
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
  return hourNames[hour] || hour.toString();
}

// Helper function to get minute name in Spanish
function getMinuteName(minute) {
  const minuteNames = {
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
    20: 'veinte',
    30: 'treinta',
    40: 'cuarenta',
    50: 'cincuenta'
  };
  return minuteNames[minute] || minute.toString();
}

// Helper function to play a queue of audio files sequentially
// Helper function to play a queue of audio files sequentially with delays
// Modified playAudioQueue function with customizable delays for different sections
function playAudioQueue(queue, options = {}) {
  if (queue.length === 0) return;
  
  // Default delays
  const defaultDelay = options.defaultDelay || 400; // Regular delay between words
  const timeComponentDelay = 100; // Shorter delay within time components
  
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

// export const playAllAudio = (region, weatherConditionText, hour, timeString) => {
//   console.log(`🔊 Playing all audio for: ${region}, ${weatherConditionText}, ${timeString}`);
  
//   // Queue up the audio files to play in sequence
//   const queue = [];
  
  
//   // Region audio - add intro phrase and region name
//   if (phrasesAudioMap['intro-region']) {
//     queue.push(phrasesAudioMap['intro-region']);
//   }
//   if (regionAudioMap[region]) {
//     queue.push(regionAudioMap[region]);
//   }
  
//   // Weather audio - add intro phrase and weather condition
//   if (phrasesAudioMap['intro-weather']) {
//     queue.push(phrasesAudioMap['intro-weather']);
//   }
//   if (weatherAudioMap[weatherConditionText]) {
//     queue.push(weatherAudioMap[weatherConditionText]);
//   }
  
//   // Time audio - add intro phrase, then get time components
//   if (phrasesAudioMap['intro-time']) {
//     queue.push(phrasesAudioMap['intro-time']);
//   }
  
//   // Create a temporary queue just for time components
//   const timeQueue = [];
  
//   // Call a modified version of playTimeAudio that just returns the queue
//   getTimeAudioQueue(hour, timeString, timeQueue);
  
//   // Add the time queue to our main queue
//   queue.push(...timeQueue);
  
//   // Play the entire sequence
//   playAudioQueue(queue);
// };

// Helper function that duplicates playTimeAudio logic but returns a queue instead of playing it
// function getTimeAudioQueue(hour, timeString, queue) {
//   // Get time data
//   const date = new Date();
//   if (hour) {
//     date.setHours(hour);
//   }
//   if (timeString) {
//     const [hours, minutes] = timeString.split(':').map(Number);
//     date.setHours(hours);
//     date.setMinutes(minutes);
//   }
  
//   // Parse the hours and minutes
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const hour12 = hours % 12 || 12;
  
//   // Step 1: Add the hour introductory phrase (Son las / Es la)
//   if (hour12 === 1) {
//     queue.push('time/es-la-una.mp3');
//   } else {
//     queue.push(`time/son-las-${getHourName(hour12)}.mp3`);
//   }
  
//   // Step 2: Handle minutes - all the existing logic from playTimeAudio
//   if (minutes === 0) {
//     // Exact hour, no additional audio needed
//   } else if (minutes === 15) {
//     queue.push('phrases/y.mp3');
//     queue.push('time/minutes/cuarto.mp3');
//   } else if (minutes === 30) {
//     queue.push('phrases/y.mp3');
//     queue.push('time/minutes/media.mp3');
//   } else if (minutes === 45) {
//     queue.push('phrases/menos.mp3');
//     queue.push('time/minutes/cuarto.mp3');
//   } else if (minutes < 30) {
//     queue.push('phrases/y.mp3');
//     if (minutes <= 15 || minutes === 20) {
//       queue.push(`time/minutes/${getMinuteName(minutes)}.mp3`);
//     } else if (minutes > 15 && minutes < 20) {
//       queue.push('time/minutes/diez.mp3');
//       queue.push('phrases/y.mp3');
//       const ones = minutes - 10;
//       queue.push(`time/minutes/${getMinuteName(ones)}.mp3`);
//     } else if (minutes > 20 && minutes < 30) {
//       queue.push('time/minutes/veinte.mp3');
//       queue.push('phrases/y.mp3');
//       const ones = minutes - 20;
//       queue.push(`time/minutes/${getMinuteName(ones)}.mp3`);
//     }
//     if (minutes === 1) {
//       queue.push('phrases/minuto.mp3');
//     } else {
//       queue.push('phrases/minutos.mp3');
//     }
//   } else {
//     const minutesToNextHour = 60 - minutes;
//     if (minutesToNextHour === 15) {
//     } else {
//       queue.push('phrases/menos.mp3');
//       if (minutesToNextHour <= 15 || minutesToNextHour === 20) {
//         queue.push(`time/minutes/${getMinuteName(minutesToNextHour)}.mp3`);
//       } else if (minutesToNextHour > 15 && minutesToNextHour < 20) {
//         queue.push('time/minutes/diez.mp3');
//         queue.push('phrases/y.mp3');
//         const ones = minutesToNextHour - 10;
//         queue.push(`time/minutes/${getMinuteName(ones)}.mp3`);
//       } else if (minutesToNextHour > 20 && minutesToNextHour < 30) {
//         queue.push('time/minutes/veinte.mp3');
//         queue.push('phrases/y.mp3');
//         const ones = minutesToNextHour - 20;
//         queue.push(`time/minutes/${getMinuteName(ones)}.mp3`);
//       }
//       if (minutesToNextHour === 1) {
//         queue.push('phrases/minuto.mp3');
//       } else {
//         queue.push('phrases/minutos.mp3');
//       }
//     }
//   }
  
//   // Step 3: Add time of day
//   if (hours >= 6 && hours < 12) {
//     queue.push('time/de-la-mañana.mp3');
//   } else if (hours >= 12 && hours < 14) {
//     queue.push('time/del-mediodia.mp3');
//   } else if (hours >= 14 && hours < 21) {
//     queue.push('time/de-la-tarde.mp3');
//   } else {
//     queue.push('time/de-la-noche.mp3');
//   }
// }

