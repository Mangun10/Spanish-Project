import React from "react";

export const TimeDisplay = ({ region }) => {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
      <h2 className="text-2xl font-semibold">{region}</h2>
      <p className="text-lg mt-2">🕒 14:30</p>
    </div>
  );
};
