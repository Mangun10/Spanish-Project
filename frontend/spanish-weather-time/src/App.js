import React, { useState } from "react";
import { WeatherCard } from "./components/WeatherCard";
import { TimeDisplay } from "./components/TimeDisplay";
import { AudioPlayer } from "./components/AudioPlayer";

const App = () => {
  const [region, setRegion] = useState("Madrid");

  const regions = ["Madrid", "Barcelona", "Sevilla", "Valencia", "Bilbao"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-50 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tiempo y Hora en España</h1>
        <select
          className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-md"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-10 p-6">
        {/* Weather Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard region={region} />
          <TimeDisplay region={region} />
        </div>

        {/* Pronunciation Section */}
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-semibold">Pronunciación en Español</h2>
          <p className="text-lg mt-2 opacity-80">
            Escucha la pronunciación del tiempo y la hora en {region}.
          </p>
          <AudioPlayer region={region} />
        </div>
      </div>
    </div>
  );
};

export default App;
