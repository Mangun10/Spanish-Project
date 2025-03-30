import React from 'react';

const Regions = () => {
    const regions = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao'];

    return (
        <div className="regions-page p-4">
            <h1 className="text-2xl font-bold">Select a Region</h1>
            <ul className="regions-list">
                {regions.map((region) => (
                    <li key={region} className="region-item p-2 bg-gray-200 rounded-lg shadow-md my-2">
                        {region}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Regions;