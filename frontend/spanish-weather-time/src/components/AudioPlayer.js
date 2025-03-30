import React from "react";

export const AudioPlayer = ({ region }) => {
  const handlePlay = () => {
    alert(`Playing pronunciation for ${region}`);
  };

  return (
    <button
      onClick={handlePlay}
      className="mt-4 px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition"
    >
      🎧 Escuchar Pronunciación
    </button>
  );
};
