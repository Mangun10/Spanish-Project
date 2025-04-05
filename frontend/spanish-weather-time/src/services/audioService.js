// services/audioService.js

// Use the Web Speech API for text-to-speech
export const playRegionAudio = (region) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(`La región es ${region}`);
    utterance.lang = 'es-ES'; // Spanish from Spain
    utterance.rate = 0.7; // Slightly slower for better clarity
    
    // Get Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es') && voice.name.includes('Google'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback for browsers that don't support speech synthesis
    alert(`🔊 Pronunciación: "${region}"`);
  }
};

export const playWeatherAudio = (conditionCode, conditionText) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(`El tiempo está ${conditionText}`);
    utterance.lang = 'es-ES';
    utterance.rate = 0.7;
    
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es') && voice.name.includes('Google'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert(`🔊 Pronunciación: "${conditionText}"`);
  }
};

export const playTimeAudio = (hour, timeString) => {
  if ('speechSynthesis' in window) {
    // Parse the timeString that was passed to the function
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    console.log("Speaking Time:", hours, minutes, timeString); // Debugging line
    
    // Format time in Spanish with hours, minutes and time of day
    let timePhrase = '';
    let timeOfDay = '';
    
    // Determine time of day in Spanish
    if (hours >= 6 && hours < 12) {
      timeOfDay = 'de la mañana';
    } else if (hours >= 12 && hours < 14) {
      timeOfDay = 'del mediodía';
    } else if (hours >= 14 && hours < 21) {
      timeOfDay = 'de la tarde';
    } else {
      timeOfDay = 'de la noche';
    }
    
    // Format the hour phrase
    if (hours === 1 || hours === 13) {
      timePhrase = `Es la una`;
    } else if (hours === 0 || hours === 24) {
      timePhrase = `Son las doce`;
    } else if (hours === 12) {
      timePhrase = `Son las doce`;
    } else {
      // Convert 24-hour format to 12-hour format for speaking
      const hour12 = hours > 12 ? hours - 12 : hours;
      timePhrase = `Son las ${hour12}`;
    }
    
    // Add minutes if not at the hour
    if (minutes > 0) {
      timePhrase += ` y ${minutes} minutos`;
    }
    
    // Complete phrase with time of day
    timePhrase += ` ${timeOfDay}`;
    
    console.log("Final Time Phrase:", timePhrase); // Debugging line
    
    const utterance = new SpeechSynthesisUtterance(timePhrase);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es') && voice.name.includes('Google'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert(`🔊 Pronunciación: "${timeString}"`);
  }
};

// Add a function to play all audio in sequence
export const playAllAudio = (region, weatherConditionText, hour, timeString) => {
  if ('speechSynthesis' in window) {
    const script = `La región es ${region}. El tiempo está ${weatherConditionText}.`;
    
    // Parse the timeString that was passed to the function
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Format time phrase
    let timePhrase = '';
    let timeOfDay = '';
    
    if (hours >= 6 && hours < 12) {
      timeOfDay = 'de la mañana';
    } else if (hours >= 12 && hours < 14) {
      timeOfDay = 'del mediodía';
    } else if (hours >= 14 && hours < 21) {
      timeOfDay = 'de la tarde';
    } else {
      timeOfDay = 'de la noche';
    }
    
    if (hours === 1 || hours === 13) {
      timePhrase = `Es la una`;
    } else if (hours === 0 || hours === 24) {
      timePhrase = `Son las doce`;
    } else if (hours === 12) {
      timePhrase = `Son las doce`;
    } else {
      const hour12 = hours > 12 ? hours - 12 : hours;
      timePhrase = `Son las ${hour12}`;
    }
    
    if (minutes > 0) {
      timePhrase += ` y ${minutes} minutos`;
    }
    
    timePhrase += ` ${timeOfDay}`;
    
    const fullScript = `${script} ${timePhrase}`;
    console.log("Full Script:", fullScript); // Debugging line
    
    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es') && voice.name.includes('Google'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert(`🔊 Región: "${region}"\n🔊 Tiempo: "${weatherConditionText}"\n🔊 Hora: "${timeString}"`);
  }
};