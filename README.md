# Spanish Weather & Time Pronunciation

![Spanish Pronunciation](https://img.shields.io/badge/Spanish-Pronunciation-red)
![React](https://img.shields.io/badge/React-17.0.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2.19-38B2AC)

A web application designed to help users learn Spanish pronunciations of weather conditions and time expressions. This interactive tool provides real-time weather information and current time for various regions in Spain, along with audio pronunciations in Spanish.

## Features

- **Weather Information**: Display of current weather conditions in Spanish regions with temperature.
- **Time Display**: Real-time clock showing the current time in selected Spanish regions.
- **Audio Pronunciation**: Audio playback for:
  - Region names in Spanish
  - Weather conditions in Spanish
  - Time expressions in Spanish
- **Interactive UI**: Responsive design with Tailwind CSS for a seamless experience on all devices.

## Project Structure

```
frontend/spanish-weather-time/
├── public/
│   ├── index.html
├── src/
│   ├── assets/
│   │   ├── audio/
│   │   │   ├── regions/    # Audio files for region names
│   │   │   ├── weather/    # Audio files for weather conditions
│   │   │   ├── time/       # Audio files for time expressions
│   ├── components/
│   │   ├── WeatherCard.js  # Weather display component
│   │   ├── TimeDisplay.js  # Time display component
│   │   ├── AudioPlayer.js  # Audio playback component
│   ├── pages/
│   │   ├── Home.js         # Main page
│   │   ├── Regions.js      # Region selection page
│   ├── services/
│   │   ├── weatherService.js # Service for fetching weather data
│   │   ├── timeService.js    # Service for fetching time data
│   │   ├── audioService.js   # Service for audio playback
│   ├── App.js
│   ├── index.js
├── package.json
├── tailwind.config.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mangun10/Spanish-Project.git
   cd Spanish-Project/frontend/spanish-weather-time
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Integration

This project uses the following APIs:

- **OpenWeatherMap API**: For weather data
  - You'll need to obtain an API key from [OpenWeatherMap](https://openweathermap.org/)
  - Add your API key to `weatherService.js`

- **WorldTimeAPI**: For current time data
  - No API key required

## Adding Audio Files

To add your own audio pronunciations:

1. Record or obtain audio files in MP3 format for:
   - Region names in Spanish (e.g., "Madrid", "Barcelona")
   - Weather conditions in Spanish (e.g., "soleado", "lluvioso")
   - Time expressions in Spanish (e.g., "buenos días", "buenas tardes")

2. Place the files in the appropriate directories:
   - `src/assets/audio/regions/`
   - `src/assets/audio/weather/`
   - `src/assets/audio/time/`

3. Ensure the filenames match the expected values in `audioService.js`

## Usage

### Home Page
- Displays the current weather and time for a default region
- Click on the audio buttons to hear pronunciations
- Use "Reproducir Todo" to play all pronunciations in sequence

### Regions Page
- Select different regions to view their weather and time information
- Click on region names to hear their Spanish pronunciations

## Technologies Used

- **React.js**: Frontend framework
- **Tailwind CSS**: Styling
- **Web Audio API**: Audio playback
- **OpenWeatherMap API**: Weather data
- **WorldTimeAPI**: Time data


## Contact

Project Link: [https://github.com/Mangun10/Spanish-Project](https://github.com/Mangun10/Spanish-Project)
