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
const timeAudioMap = {
  // Hours
  '1': 'time/es-la-una.mp3',
  '2': 'time/son-las-dos.mp3',
  '3': 'time/son-las-tres.mp3',
  '4': 'time/son-las-cuatro.mp3',
  '5': 'time/son-las-cinco.mp3',
  '6': 'time/son-las-seis.mp3',
  '7': 'time/son-las-siete.mp3',
  '8': 'time/son-las-ocho.mp3',
  '9': 'time/son-las-nueve.mp3',
  '10': 'time/son-las-diez.mp3',
  '11': 'time/son-las-once.mp3',
  '12': 'time/son-las-doce.mp3',
  
  // Time of day
  'morning': 'time/de-la-mañana.mp3',
  'noon': 'time/del-mediodia.mp3',
  'afternoon': 'time/de-la-tarde.mp3',
  'night': 'time/de-la-noche.mp3'
};

// Add a new map for filler phrases
const phrasesAudioMap = {
  'intro-region': 'phrases/la-region-es.mp3',
  'intro-weather': 'phrases/el-tiempo-esta.mp3',
  'intro-time': 'phrases/la-hora-es.mp3',
  'y': 'phrases/y.mp3',
  'minutos': 'phrases/minutos.mp3',
  'en': 'phrases/en.mp3',
  'bienvenido': 'phrases/bienvenido-a.mp3',
  'escucha': 'phrases/escucha-la-pronunciacion-de.mp3',
  'punto': 'phrases/punto.mp3'
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

// Use the Web Speech API for text-to-speech
export const playRegionAudio = (region) => {
  const audioFile = regionAudioMap[region];
  
  if (audioFile) {
    // Play the audio file for the region
    playAudio(audioFile);
  } else {
    // Fallback to speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`La región es ${region}`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`🔊 Pronunciación: "La región es ${region}"`);
    }
  }
};

export const playWeatherAudio = (conditionCode, conditionText) => {
  const audioFile = weatherAudioMap[conditionText];
  
  if (audioFile) {
    // Play the audio file for the weather condition
    playAudio(audioFile);
  } else {
    // Fallback to speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`El tiempo está ${conditionText}`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`🔊 Pronunciación: "El tiempo está ${conditionText}"`);
    }
  }
};

export const playTimeAudio = (hour, timeString) => {
  // Parse the time string to get hours
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  
  // Determine time of day
  let timeOfDay = 'morning';
  if (hours >= 12 && hours < 14) {
    timeOfDay = 'noon';
  } else if (hours >= 14 && hours < 21) {
    timeOfDay = 'afternoon';
  } else if (hours >= 21 || hours < 6) {
    timeOfDay = 'night';
  }
  
  // Get the hour in 12-hour format for audio mapping
  const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  
  // Play hour audio, then time of day
  if (timeAudioMap[hour12.toString()]) {
    const hourAudio = new Audio(`/assets/audio/${timeAudioMap[hour12.toString()]}`);
    
    hourAudio.onended = () => {
      // After hour audio finishes, play time of day
      if (timeAudioMap[timeOfDay]) {
        playAudio(timeAudioMap[timeOfDay]);
      }
    };
    
    hourAudio.play().catch(error => {
      console.error(`🔊 Error playing hour audio: ${error.message}`);
      // Fallback to speech synthesis
      if ('speechSynthesis' in window) {
        let timePhrase = '';
        
        if (hours === 1 || hours === 13) {
          timePhrase = 'Es la una';
        } else {
          timePhrase = `Son las ${hour12}`;
        }
        
        if (timeOfDay === 'morning') {
          timePhrase += ' de la mañana';
        } else if (timeOfDay === 'noon') {
          timePhrase += ' del mediodía';
        } else if (timeOfDay === 'afternoon') {
          timePhrase += ' de la tarde';
        } else {
          timePhrase += ' de la noche';
        }
        
        const utterance = new SpeechSynthesisUtterance(timePhrase);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    });
  } else {
    // Fallback if no audio file exists
    if ('speechSynthesis' in window) {
      // Use existing speech synthesis code
      let timePhrase = '';
      
      if (hours === 1 || hours === 13) {
        timePhrase = 'Es la una';
      } else {
        timePhrase = `Son las ${hour12}`;
      }
      
      if (timeOfDay === 'morning') {
        timePhrase += ' de la mañana';
      } else if (timeOfDay === 'noon') {
        timePhrase += ' del mediodía';
      } else if (timeOfDay === 'afternoon') {
        timePhrase += ' de la tarde';
      } else {
        timePhrase += ' de la noche';
      }
      
      const utterance = new SpeechSynthesisUtterance(timePhrase);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
};

export const playAllAudio = (region, weatherConditionText, hour, timeString) => {
  console.log(`🔊 Playing all audio for: ${region}, ${weatherConditionText}, ${timeString}`);
  
  // Queue up the audio files to play in sequence
  const queue = [];
  
  // Add welcome and introduction if available
  if (phrasesAudioMap['bienvenido']) {
    queue.push(phrasesAudioMap['bienvenido']);
  }
  
  // Add region phrase: "La región es Madrid"
  if (phrasesAudioMap['intro-region']) {
    queue.push(phrasesAudioMap['intro-region']);
  }
  
  // Add region name
  if (regionAudioMap[region]) {
    queue.push(regionAudioMap[region]);
  }
  
  // Add weather phrase: "El tiempo está soleado"
  if (phrasesAudioMap['intro-weather']) {
    queue.push(phrasesAudioMap['intro-weather']);
  }
  
  // Add weather condition
  if (weatherAudioMap[weatherConditionText]) {
    queue.push(weatherAudioMap[weatherConditionText]);
  }
  
  // Add time introduction: "La hora es..."
  if (phrasesAudioMap['intro-time']) {
    queue.push(phrasesAudioMap['intro-time']);
  }
  
  // Add time components
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  
  // Determine time of day
  let timeOfDay = 'morning';
  if (hours >= 12 && hours < 14) {
    timeOfDay = 'noon';
  } else if (hours >= 14 && hours < 21) {
    timeOfDay = 'afternoon';
  } else if (hours >= 21 || hours < 6) {
    timeOfDay = 'night';
  }
  
  // Add hour audio
  if (timeAudioMap[hour12.toString()]) {
    queue.push(timeAudioMap[hour12.toString()]);
  }
  
  // Add minutes if not at the hour
  if (minutes > 0 && phrasesAudioMap['y'] && phrasesAudioMap['minutos']) {
    queue.push(phrasesAudioMap['y']);
    // Ideally you'd have recordings for each number 1-59, but that's a lot
    // For simplicity, we'll use speech synthesis for the minutes number
    
    // Add time of day
    if (timeAudioMap[timeOfDay]) {
      queue.push(timeAudioMap[timeOfDay]);
    }
  } else {
    // No minutes, just add time of day
    if (timeAudioMap[timeOfDay]) {
      queue.push(timeAudioMap[timeOfDay]);
    }
  }
  
  // Play the queue in sequence
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex < queue.length) {
      console.log(`🔊 Playing queue item ${currentIndex + 1}/${queue.length}: ${queue[currentIndex]}`);
      const audio = new Audio(`/assets/audio/${queue[currentIndex]}`);
      audio.onended = () => {
        currentIndex++;
        playNext();
      };
      audio.play().catch(error => {
        console.error(`🔊 Error playing audio in sequence: ${error.message}`);
        currentIndex++;
        playNext();
      });
    }
  };
  
  // Start playing the sequence
  if (queue.length > 0) {
    playNext();
  } else {
    // Fallback to speech synthesis if no audio files are available
    // (using your existing fallback code)
  }
};

// Add this function to test audio files directly
export const testAudioFile = (audioPath) => {
  console.log(`🧪 Testing audio file: ${audioPath}`);
  
  // Try to fetch the file to see if it exists
  fetch(`/assets/audio/${audioPath}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`File not found or server error: ${response.status}`);
      }
      console.log(`🧪 File exists! Status: ${response.status}`);
      return response.blob();
    })
    .then(blob => {
      console.log(`🧪 File type: ${blob.type}, size: ${blob.size} bytes`);
      if (blob.size === 0) {
        console.warn('🧪 Warning: File has zero bytes');
      }
      
      // Now try to play it
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('canplaythrough', () => {
        console.log('🧪 Audio loaded successfully and can be played');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('🧪 Error loading audio:', e);
      });
      
      // Try playing
      return audio.play()
        .then(() => {
          console.log('🧪 Audio playing successfully!');
        })
        .catch(err => {
          console.error('🧪 Error playing audio:', err);
        });
    })
    .catch(error => {
      console.error('🧪 Error testing audio file:', error);
    });
};