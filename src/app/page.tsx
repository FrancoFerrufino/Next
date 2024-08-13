'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    async function fetchVehicleTypes() {
      const res = await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      );
      const data = await res.json();
      setVehicleTypes(data.Results);
    }
    fetchVehicleTypes();
  }, []);

  const years = Array.from(
    { length: new Date().getFullYear() - 2014 },
    (_, i) => 2015 + i
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Car Dealer Filter</h1>
      <div className="flex space-x-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedVehicleType}
          onChange={(e) => setSelectedVehicleType(e.target.value)}
        >
          <option value="">Select Vehicle Type</option>
          {vehicleTypes.map((type) => (
            <option key={type.MakeName} value={type.MakeId}>
              {type.MakeName}
            </option>
          ))}
        </select>

        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Model Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`px-4 py-2 font-bold text-white rounded ${
          selectedVehicleType && selectedYear
            ? 'bg-blue-500 hover:bg-blue-700'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
        disabled={!selectedVehicleType || !selectedYear}
        onClick={() => {
          if (selectedVehicleType && selectedYear) {
            window.location.href = `/result/${selectedVehicleType}/${selectedYear}`;
          }
        }}
      >
        Next
      </button>
    </div>
  );
}
